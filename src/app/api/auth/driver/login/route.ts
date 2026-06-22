import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

type DriverLoginResult = {
  id: string;
  email: string;
  commission_pct: number;
};

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const driver = await callSheets<DriverLoginResult>("driver.login", {
      username: parsed.data.email,
      password: parsed.data.password,
    });
    await setSessionCookie({
      sub: driver.id,
      role: "driver",
      email: parsed.data.email,
    });
    return NextResponse.json({ ok: true, driver });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
