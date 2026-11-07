import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import type { Category, Collection, Product } from "@/types";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}

export function getNewArrivals(limit?: number): Product[] {
  const items = products.filter((product) => product.isNew);
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function getBestsellers(limit?: number): Product[] {
  const items = products.filter((product) => product.isBestseller);
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (item) => item.category === product.category && item.slug !== product.slug,
  );
  const others = products.filter(
    (item) => item.category !== product.category && item.slug !== product.slug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getCollectionProducts(collection: Collection): Product[] {
  return collection.productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product));
}

export function countInCategory(slug: string): number {
  return products.filter((product) => product.category === slug).length;
}

export function searchProducts(query: string, limit?: number): Product[] {
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
