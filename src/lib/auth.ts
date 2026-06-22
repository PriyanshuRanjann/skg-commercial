import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Role = "driver" | "owner";

export type Session = {
  sub: string;
  role: Role;
  name?: string;
  email?: string;
};

const COOKIE_NAME = "mm_session";
const TWELVE_HOURS = 60 * 60 * 12;

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not configured");
  return new TextEncoder().encode(s);
}

export async function signSession(session: Session): Promise<string> {
  return await new SignJWT({ role: session.role, name: session.name, email: session.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${TWELVE_HOURS}s`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || (payload.role !== "driver" && payload.role !== "owner")) return null;
    return {
      sub: String(payload.sub),
      role: payload.role as Role,
      name: payload.name as string | undefined,
      email: payload.email as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySession(token);
}

export async function requireRole(role: Role): Promise<Session> {
  const s = await getSession();
  if (!s || s.role !== role) {
    throw new AuthError(`requires_${role}`);
  }
  return s;
}

export async function setSessionCookie(session: Session) {
  const token = await signSession(session);
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TWELVE_HOURS,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
