import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { getSession } from "@/lib/auth";
import { driverUpsertSchema } from "@/lib/validation";

async function requireOwner() {
  const s = await getSession();
  if (!s || s.role !== "owner") return null;
  return s;
}

export async function GET() {
  if (!(await requireOwner())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const drivers = await callSheets<unknown[]>("owner.list", { kind: "drivers" });
    return NextResponse.json({ ok: true, drivers });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}

export async function POST(req: Request) {
  if (!(await requireOwner())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = driverUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const driver = await callSheets("driver.upsert", parsed.data);
    return NextResponse.json({ ok: true, driver });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireOwner())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }
  try {
    await callSheets("driver.delete", { id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
