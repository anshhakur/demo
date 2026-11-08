import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Admin access = secret URL (ADMIN_PATH) + password (ADMIN_PASSWORD).
 * After logging in, a signed, httpOnly cookie keeps you signed in for 12 hours.
 */
export const SESSION_COOKIE = "bx_admin";
const SESSION_SECONDS = 60 * 60 * 12;

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PATH && process.env.ADMIN_PASSWORD);
}

function signingSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string): string {
  return createHmac("sha256", signingSecret()).update(value).digest("hex");
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const hashA = createHmac("sha256", "bazaarex-compare").update(a).digest();
  const hashB = createHmac("sha256", "bazaarex-compare").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function createSessionToken(): string {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !signingSecret()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  const expected = Buffer.from(sign(expires));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;
  return Number(expires) > Date.now() / 1000;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** For API routes: returns an error response if the caller is not signed in, otherwise null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured on the server." }, { status: 503 });
  }
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  return null;
}
