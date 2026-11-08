import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { collections } from "@/data/collections";
import { products as sampleProducts } from "@/data/products";
import type { CategorySlug, Product, ProductImage } from "@/types";

export const MEDIA_BUCKET = "media";
export const CATALOG_TAG = "catalog";

/** True when the Supabase environment variables needed to read and write products are set. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Server-only client using the service role key. Never import this from a client component. */
export function getAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Public URL prefix that all uploaded media must start with. */
export function mediaPublicPrefix(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/storage/v1/object/public/${MEDIA_BUCKET}/`;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  collection: string | null;
  description: string;
  details: string[] | null;
  fabric: string;
  colour: string;
  sizes: string[] | null;
  images: ProductImage[] | null;
  video: string | null;
  is_new: boolean;
  is_bestseller: boolean;
  created_at?: string;
}

export type NewProductRow = Omit<ProductRow, "id" | "created_at">;

const FALLBACK_IMAGE = "/images/hero/hero-side-1.svg";

export function rowToProduct(row: ProductRow): Product {
  const images =
    row.images && row.images.length > 0 ? row.images : [{ src: FALLBACK_IMAGE, alt: row.name }];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    category: row.category as CategorySlug,
    collection: row.collection ?? undefined,
    description: row.description,
    details: row.details ?? [],
    fabric: row.fabric,
    colour: row.colour,
    sizes: row.sizes && row.sizes.length > 0 ? row.sizes : ["One size"],
    images,
    video: row.video ?? undefined,
    isNew: row.is_new,
    isBestseller: row.is_bestseller,
  };
}

export function sampleToRow(product: Product): NewProductRow {
  const collection = collections.find((item) => item.productSlugs.includes(product.slug));
  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    category: product.category,
    collection: collection ? collection.slug : null,
    description: product.description,
    details: product.details,
    fabric: product.fabric,
    colour: product.colour,
    sizes: product.sizes,
    images: product.images,
    video: product.video ?? null,
    is_new: Boolean(product.isNew),
    is_bestseller: Boolean(product.isBestseller),
  };
}

/** Reads products straight from the database (no cache). Used by the admin page. */
export async function listProductsFresh(): Promise<Product[]> {
  const { data, error } = await getAdminClient()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as ProductRow[]).map(rowToProduct);
}

async function fetchCatalog(): Promise<Product[]> {
  // Without Supabase the site runs on the sample data in /data/products.ts.
  if (!isSupabaseConfigured()) return sampleProducts;

  const { data, error } = await getAdminClient()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // The products table has not been created yet: keep the site usable with sample data.
    if (error.code === "PGRST205" || error.code === "42P01") {
      console.warn("[catalog] The products table does not exist yet. Run supabase/schema.sql. Showing sample data.");
      return sampleProducts;
    }
    throw new Error(`Could not load products from Supabase: ${error.message}`);
  }
  return ((data ?? []) as ProductRow[]).map(rowToProduct);
}

/**
 * The product list for the storefront. Cached for 60 seconds and refreshed
 * immediately whenever the admin adds or removes a product.
 */
export const getCatalog = unstable_cache(fetchCatalog, ["catalog-v1"], {
  revalidate: 60,
  tags: [CATALOG_TAG],
});
