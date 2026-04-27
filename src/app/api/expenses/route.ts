import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { getSession } from "@/lib/auth";
import { expenseSchema } from "@/lib/validation";

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

  const parsed = expenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const result = await callSheets<{ id: string }>("expense.create", {
      ...parsed.data,
      driver_id: session.sub,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
