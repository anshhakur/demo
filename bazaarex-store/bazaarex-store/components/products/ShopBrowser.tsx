"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types";

type SortKey = "featured" | "price-asc" | "price-desc";

interface ShopBrowserProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
}

export function ShopBrowser({
  products,
  categories,
  initialCategory = "all",
  initialQuery = "",
}: ShopBrowserProps) {
  const validInitial = categories.some((c) => c.slug === initialCategory) ? initialCategory : "all";
  const [category, setCategory] = useState<string>(validInitial);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (terms.length === 0) return true;
      const haystack = `${product.name} ${product.colour} ${product.category} ${product.description}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, category, query, sort]);

  const chips = [{ slug: "all", name: "All" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))];
  const hasFilters = category !== "all" || query.trim() !== "";

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {chips.map((chip) => {
            const selected = category === chip.slug;
            return (
              <button
                key={chip.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(chip.slug)}
                className={cn(
                  "shrink-0 border px-4 py-2 text-sm transition-colors",
                  selected
                    ? "border-charcoal bg-charcoal text-ivory"
                    : "border-beige hover:border-charcoal",
                )}
              >
                {chip.name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label htmlFor="shop-filter" className="sr-only">
              Search within the shop
            </label>
            <input
              id="shop-filter"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="w-full border border-beige bg-white px-4 py-2 text-sm placeholder:text-grey sm:w-56"
            />
          </div>
          <div>
            <label htmlFor="shop-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full border border-beige bg-white px-3 py-2 text-sm sm:w-auto"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-grey" aria-live="polite">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      <div className="mt-6">
        {visible.length > 0 ? (
          <ProductGrid products={visible} priorityCount={4} />
        ) : (
          <div className="py-16">
            <p className="font-serif text-3xl">Nothing matches that search.</p>
            <p className="mt-3 text-grey">Try another word or clear the filters.</p>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setQuery("");
                }}
                className="mt-6 text-sm font-medium underline underline-offset-8"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
