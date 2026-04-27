import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { setSessionCookie } from "@/lib/auth";
import { ownerSignupSchema } from "@/lib/validation";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = ownerSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const result = await callSheets<{ username: string }>(
      "owner.signup",
      parsed.data
    );
    // Auto-login: set session cookie immediately on first-owner bootstrap
    await setSessionCookie({
      sub: result.username,
      role: "owner",
      username: result.username,
    });
    return NextResponse.json({ ok: true, owner: result });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
