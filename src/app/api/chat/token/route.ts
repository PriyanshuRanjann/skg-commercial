import { NextResponse } from "next/server";

const ORG_ID = "fb651a62-6742-464c-afca-749883013c5a";

let cachedToken: string | null = null;

export async function GET() {
  if (cachedToken) return NextResponse.json({ token: cachedToken });

  try {
    const res = await fetch("https://sellers.trythat.ai/api/v1/auth/public-widget-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_id: ORG_ID }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "token_fetch_failed" }, { status: 500 });
    }

    const data = await res.json();
    if (!data.token) {
      return NextResponse.json({ error: "no_token_in_response" }, { status: 500 });
    }

    cachedToken = data.token as string;
    return NextResponse.json({ token: cachedToken });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 500 });
  }
}
