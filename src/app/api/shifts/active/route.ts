import { NextResponse } from "next/server";
import { callSheets, SheetsError } from "@/lib/sheets";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "driver") {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const shift = await callSheets<Record<string, unknown> | null>("shift.active", {
      driver_id: session.sub,
    });
    return NextResponse.json({ ok: true, shift });
  } catch (e) {
    const err = e instanceof SheetsError ? e : new SheetsError("server_error");
    return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
  }
}
