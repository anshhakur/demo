import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { MEDIA_BUCKET, getAdminClient, isSupabaseConfigured, mediaPublicPrefix } from "@/lib/catalog";

export const runtime = "nodejs";

/**
 * Returns a one-time signed upload URL so the browser can send photos and videos
 * straight to Supabase Storage (they never pass through this server, which has a small body limit).
 */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not connected yet." }, { status: 503 });
  }

  let body: { filename?: unknown; contentType?: unknown };
  try {
    body = (await request.json()) as { filename?: unknown; contentType?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const contentType = typeof body.contentType === "string" ? body.contentType : "";
  const isImage = contentType.startsWith("image/");
  const isVideo = contentType.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Only photos and videos can be uploaded." }, { status: 400 });
  }

  const filename = typeof body.filename === "string" ? body.filename : "";
  const rawExt = filename.includes(".") ? (filename.split(".").pop() ?? "") : "";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || (isImage ? "jpg" : "mp4");
  const path = `${isImage ? "images" : "videos"}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  const { data, error } = await getAdminClient().storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Could not start the upload." }, { status: 500 });
  }

  return NextResponse.json({
    path: data.path,
    token: data.token,
    publicUrl: `${mediaPublicPrefix()}${data.path}`,
  });
}
