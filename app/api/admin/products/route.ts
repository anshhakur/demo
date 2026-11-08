import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  CATALOG_TAG,
  MEDIA_BUCKET,
  getAdminClient,
  isSupabaseConfigured,
  mediaPublicPrefix,
  rowToProduct,
} from "@/lib/catalog";
import type { ProductRow } from "@/lib/catalog";
import { parseNewProduct, slugify } from "@/lib/product-input";

export const runtime = "nodejs";

function refreshStorefront() {
  revalidateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

/** Add a product. */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not connected yet." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseNewProduct(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const client = getAdminClient();

  // Find a slug that is not taken yet: name, name-2, name-3 ...
  const base = slugify(parsed.row.name) || "product";
  const { data: existing, error: slugError } = await client
    .from("products")
    .select("slug")
    .like("slug", `${base}%`);
  if (slugError) return NextResponse.json({ error: slugError.message }, { status: 500 });
  const taken = new Set((existing ?? []).map((row: { slug: string }) => row.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n += 1) slug = `${base}-${n}`;

  const { data, error } = await client
    .from("products")
    .insert({ ...parsed.row, slug })
    .select("*")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Could not save the product." }, { status: 500 });
  }

  refreshStorefront();
  return NextResponse.json({ product: rowToProduct(data as ProductRow) });
}

/** Remove a product (and its uploaded photos and video). */
export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not connected yet." }, { status: 503 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing product id." }, { status: 400 });

  const client = getAdminClient();
  const { data: row } = await client.from("products").select("images, video").eq("id", id).maybeSingle();

  const { error } = await client.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Best effort: delete the files this product uploaded.
  if (row) {
    const prefix = mediaPublicPrefix();
    const urls: string[] = [
      ...((row.images as Array<{ src: string }> | null) ?? []).map((image) => image.src),
      ...(row.video ? [row.video as string] : []),
    ];
    const paths = urls.filter((url) => url.startsWith(prefix)).map((url) => url.slice(prefix.length));
    if (paths.length > 0) await client.storage.from(MEDIA_BUCKET).remove(paths);
  }

  refreshStorefront();
  return NextResponse.json({ ok: true });
}
