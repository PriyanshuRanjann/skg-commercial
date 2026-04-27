/**
 * Server-side client for the Apps Script Web App.
 * Never import this from a client component — it carries the API token.
 *
 * If APPS_SCRIPT_URL is unset (e.g. local dev before deploying the script),
 * calls are routed to an in-memory mock so the app is fully usable locally.
 */
import { mockCall, isMockMode } from "@/lib/mock-store";

const TOKEN = process.env.APPS_SCRIPT_TOKEN;

type Action =
  | "driver.login"
  | "owner.login"
  | "shift.start"
  | "shift.end"
  | "shift.active"
  | "ride.create"
  | "expense.create"
  | "feedback.create"
  | "owner.list"
  | "driver.upsert"
  | "driver.delete"
  | "settings.get"
  | "settings.set"
  | "history.driver";

const PUBLIC_ACTIONS: Action[] = ["feedback.create"];

type Envelope<T> = { ok: true; data: T } | { ok: false; error: string };

export class SheetsError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export async function callSheets<T = unknown>(
  action: Action,
  payload: Record<string, unknown> = {}
): Promise<T> {
  if (isMockMode()) {
    try {
      return (await mockCall(action, payload)) as T;
    } catch (e) {
      const msg = (e as Error).message || "mock_error";
      const status =
        msg === "invalid_credentials" || msg === "unauthorized" ? 401 : 400;
      throw new SheetsError(msg, status);
    }
  }

  const url = process.env.APPS_SCRIPT_URL!;
  const body: Record<string, unknown> = { action, ...payload };
  if (!PUBLIC_ACTIONS.includes(action)) {
    if (!TOKEN) throw new SheetsError("APPS_SCRIPT_TOKEN not configured", 500);
    body.apiToken = TOKEN;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
      cache: "no-store",
    });
  } catch (e) {
    throw new SheetsError(`network_error: ${(e as Error).message}`, 502);
  }

  if (!res.ok) throw new SheetsError(`upstream_${res.status}`, 502);

  const json = (await res.json()) as Envelope<T>;
  if (!json.ok) {
    const err = (json as { error: string }).error || "unknown_error";
    const status = err === "unauthorized" || err === "invalid_credentials" ? 401 : 400;
    throw new SheetsError(err, status);
  }
  return json.data;
}
