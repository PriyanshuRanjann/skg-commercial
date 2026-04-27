import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

type OwnerLoginResult = { username: string };

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
    const owner = await callSheets<OwnerLoginResult>("owner.login", parsed.data);
    await setSessionCookie({
      sub: owner.username,
      role: "owner",
      username: owner.username,
    });
    return NextResponse.json({ ok: true, owner });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
