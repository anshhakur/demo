import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { mediaPublicPrefix } from "@/lib/catalog";
import type { NewProductRow } from "@/lib/catalog";
import type { ProductImage } from "@/types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function stringList(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

/** Only our own storage URLs and the bundled /images placeholders are accepted as media. */
function isAllowedMedia(url: string): boolean {
  const prefix = mediaPublicPrefix();
  return (prefix.startsWith("http") && url.startsWith(prefix)) || url.startsWith("/images/");
}

export type ParsedProduct = { ok: true; row: NewProductRow } | { ok: false; error: string };

export function parseNewProduct(input: unknown): ParsedProduct {
  if (typeof input !== "object" || input === null) return { ok: false, error: "Invalid request." };
  const body = input as Record<string, unknown>;

  const name = text(body.name, 120);
  if (!name) return { ok: false, error: "Enter a product name." };

  const price = typeof body.price === "number" ? body.price : Number(body.price);
  if (!Number.isInteger(price) || price < 1 || price > 10_000_000) {
    return { ok: false, error: "Enter a price in whole rupees, for example 2490." };
  }

  const category = text(body.category, 40);
  if (!categories.some((item) => item.slug === category)) {
    return { ok: false, error: "Choose a category." };
  }

  const collectionRaw = text(body.collection, 60);
  if (collectionRaw && !collections.some((item) => item.slug === collectionRaw)) {
    return { ok: false, error: "Unknown collection." };
  }

  const images: ProductImage[] = [];
  if (Array.isArray(body.images)) {
    for (const item of body.images.slice(0, 8)) {
      if (typeof item !== "object" || item === null) continue;
      const image = item as Record<string, unknown>;
      const src = text(image.src, 600);
      if (src && isAllowedMedia(src)) images.push({ src, alt: text(image.alt, 200) || name });
    }
  }
  if (images.length === 0) return { ok: false, error: "Add at least one photo." };

  const videoRaw = text(body.video, 600);
  if (videoRaw && !isAllowedMedia(videoRaw)) return { ok: false, error: "Invalid video." };

  const sizes = stringList(body.sizes, 12, 12);
  if (sizes.length === 0) return { ok: false, error: "Add at least one size, for example S, M, L, XL." };

  return {
    ok: true,
    row: {
      slug: "", // filled in by the route once a unique slug is found
      name,
      price,
      category,
      collection: collectionRaw || null,
      description: text(body.description, 2000),
      details: stringList(body.details, 20, 160),
      fabric: text(body.fabric, 300),
      colour: text(body.colour, 60),
      sizes,
      images,
      video: videoRaw || null,
      is_new: body.isNew === true,
      is_bestseller: body.isBestseller === true,
    },
  };
}
