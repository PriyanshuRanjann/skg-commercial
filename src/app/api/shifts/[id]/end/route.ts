import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { getSession } from "@/lib/auth";
import { shiftEndSchema } from "@/lib/validation";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "driver") {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = shiftEndSchema.safeParse({ ...body, shift_id: id });
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    await callSheets("shift.end", parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
