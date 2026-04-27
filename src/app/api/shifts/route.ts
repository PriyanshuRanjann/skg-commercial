import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { getSession } from "@/lib/auth";
import { shiftStartSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "driver") {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = shiftStartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const result = await callSheets<{ shift_id: string }>("shift.start", {
      driver_id: session.sub,
      ...parsed.data,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
