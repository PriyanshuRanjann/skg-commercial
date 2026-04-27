import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/mock-store";

export async function GET() {
  return NextResponse.json({ demo: isMockMode() });
}
