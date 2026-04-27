import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth";

export const config = {
  // Protect everything under /driver and /owner except their /login pages.
  matcher: [
    "/driver/:path*",
    "/owner/:path*",
  ],
};

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicAuthPage =
    path === "/driver/login" ||
    path === "/owner/login" ||
    path === "/driver/signup" ||
    path === "/owner/signup";
  if (isPublicAuthPage) return NextResponse.next();

  const wantsRole: "driver" | "owner" = path.startsWith("/owner") ? "owner" : "driver";
  const loginUrl = new URL(`/${wantsRole}/login`, req.url);

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.redirect(loginUrl);

  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== wantsRole) return NextResponse.redirect(loginUrl);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}
