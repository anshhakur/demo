import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import type { Category, Collection, Product } from "@/types";

/* Static lookups (categories and collections live in /data). */

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

/* Helpers that work on a product list (from getCatalog() on the server, or useCatalog() in the browser). */

export function getProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getNewArrivals(products: Product[], limit?: number): Product[] {
  const flagged = products.filter((product) => product.isNew);
  const items = flagged.length > 0 ? flagged : products;
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function getBestsellers(products: Product[], limit?: number): Product[] {
  const flagged = products.filter((product) => product.isBestseller);
  const items = flagged.length > 0 ? flagged : products;
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function getRelatedProducts(products: Product[], product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (item) => item.category === product.category && item.slug !== product.slug,
  );
  const others = products.filter(
    (item) => item.category !== product.category && item.slug !== product.slug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getCollectionProducts(products: Product[], collection: Collection): Product[] {
  return products.filter(
    (product) =>
      product.collection === collection.slug || collection.productSlugs.includes(product.slug),
  );
}

export function countInCategory(products: Product[], slug: string): number {
  return products.filter((product) => product.category === slug).length;
}

export function searchProducts(products: Product[], query: string, limit?: number): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const matches = products.filter((product) => {
    const haystack = [
      product.name,
      product.colour,
      getCategoryName(product.category),
      product.description,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
  return typeof limit === "number" ? matches.slice(0, limit) : matches;
}
