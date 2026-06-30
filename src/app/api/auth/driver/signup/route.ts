import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { setSessionCookie } from "@/lib/auth";
import { driverPinSignupSchema } from "@/lib/validation";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = driverPinSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const result = await callSheets<{ id: string }>("driver.signup", {
      username: parsed.data.username,
      name: parsed.data.username,
      password: parsed.data.pin,
    });
    await setSessionCookie({
      sub: result.id,
      role: "driver",
      email: parsed.data.username,
    });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
