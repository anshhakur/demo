import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { products as sampleProducts } from "@/data/products";
import { requireAdmin } from "@/lib/admin-auth";
import { CATALOG_TAG, getAdminClient, isSupabaseConfigured, rowToProduct, sampleToRow } from "@/lib/catalog";
import type { ProductRow } from "@/lib/catalog";

export const runtime = "nodejs";

/** Copies the 16 sample products into an empty database so you can edit or remove them. */
export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not connected yet." }, { status: 503 });
  }

  const client = getAdminClient();
  const { count, error: countError } = await client
    .from("products")
    .select("id", { count: "exact", head: true });
  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });
  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: "The store already has products." }, { status: 409 });
  }

  const { data, error } = await client
    .from("products")
    .insert(sampleProducts.map(sampleToRow))
    .select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ products: ((data ?? []) as ProductRow[]).map(rowToProduct) });
}
