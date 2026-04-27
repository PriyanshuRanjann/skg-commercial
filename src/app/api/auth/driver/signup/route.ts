import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { driverSignupSchema } from "@/lib/validation";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = driverSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const result = await callSheets<{ id: string; pending: boolean }>(
      "driver.signup",
      parsed.data
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
