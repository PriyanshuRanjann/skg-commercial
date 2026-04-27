import { NextResponse } from "next/server";
import { callSheets } from "@/lib/sheets";

export async function GET() {
  try {
    const result = await callSheets<{ exists: boolean }>("owner.has_any", {});
    return NextResponse.json({ ok: true, ...result });
  } catch {
    // If backend is unreachable, fail open: assume owner exists (safer default)
    return NextResponse.json({ ok: true, exists: true });
  }
}
