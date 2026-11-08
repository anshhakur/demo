import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  isAdminConfigured,
  safeEqual,
  sessionCookieOptions,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured on the server." }, { status: 503 });
  }

  let body: { key?: unknown; password?: unknown };
  try {
    body = (await request.json()) as { key?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const keyOk = safeEqual(String(body.key ?? ""), process.env.ADMIN_PATH ?? "");
  const passwordOk = safeEqual(String(body.password ?? ""), process.env.ADMIN_PASSWORD ?? "");

  if (!keyOk || !passwordOk) {
    // A short delay slows down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return response;
}
