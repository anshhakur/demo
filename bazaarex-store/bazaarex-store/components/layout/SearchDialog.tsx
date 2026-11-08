"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";
import { formatPrice } from "@/lib/format";
import { getCategoryName, searchProducts } from "@/lib/products";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const catalog = useCatalog();
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const results = useMemo(() => searchProducts(catalog, trimmed, 5), [catalog, trimmed]);
  const totalMatches = useMemo(() => searchProducts(catalog, trimmed).length, [catalog, trimmed]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmed) return;
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    handleClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-charcoal/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-ivory shadow-xl"
            initial={{ y: "-12%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-12%", opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-10">
              <form onSubmit={handleSubmit} role="search" className="flex items-center gap-3 border-b border-charcoal pb-3">
                <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
                <label htmlFor="site-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="site-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search shirts, knitwear, linen..."
                  autoComplete="off"
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent font-serif text-2xl outline-none placeholder:text-grey sm:text-3xl"
                />
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close search"
                  className="-mr-2 p-2"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>

              <div className="mt-6 min-h-24" aria-live="polite">
                {trimmed === "" ? (
                  <p className="text-grey">Start typing to find a product by name, colour or category.</p>
                ) : results.length === 0 ? (
                  <p className="text-grey">No products match &ldquo;{trimmed}&rdquo;. Try a different word.</p>
                ) : (
                  <>
                    <ul className="divide-y divide-beige">
                      {results.map((product) => (
                        <li key={product.slug}>
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={handleClose}
                            className="flex items-center gap-4 py-3"
                          >
                            <span className="relative block h-20 w-16 shrink-0 overflow-hidden bg-beige">
                              <Image
                                src={product.images[0].src}
                                alt=""
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium">{product.name}</span>
                              <span className="block text-sm text-grey">
                                {getCategoryName(product.category)}
                              </span>
                            </span>
                            <span className="text-sm tabular-nums">{formatPrice(product.price)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/shop?q=${encodeURIComponent(trimmed)}`}
                      onClick={handleClose}
                      className="mt-5 inline-block text-sm font-medium underline underline-offset-8"
                    >
                      See all {totalMatches} {totalMatches === 1 ? "result" : "results"}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
