"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useBag } from "@/components/bag/BagProvider";
import { useCatalog } from "@/components/CatalogProvider";
import { buttonStyles } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/products";
import { bagEnquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { BagItem, Product } from "@/types";

export function BagDrawer() {
  const { items, isOpen, closeBag, changeQuantity, removeItem, clearBag } = useBag();
  const catalog = useCatalog();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeBag();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeBag]);

  const lines = items
    .map((item) => ({ item, product: getProductBySlug(catalog, item.slug) }))
    .filter((line): line is { item: BagItem; product: Product } => Boolean(line.product));

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-charcoal/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBag}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Enquiry bag"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-beige px-6 py-5">
              <h2 className="font-serif text-3xl">Your enquiry bag</h2>
              <button
                type="button"
                onClick={closeBag}
                aria-label="Close enquiry bag"
                className="-mr-2 p-2"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-5 px-6">
                <p className="font-serif text-2xl">Nothing here yet.</p>
                <p className="text-grey">
                  Choose a size on any product and add it to your bag. You can then send the whole
                  list to us on WhatsApp.
                </p>
                <Link href="/shop" onClick={closeBag} className={buttonStyles("outline")}>
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-beige overflow-y-auto px-6">
                  {lines.map(({ item, product }) => (
                    <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-5">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closeBag}
                        className="relative block h-28 w-[88px] shrink-0 overflow-hidden bg-beige"
                      >
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt}
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="mt-1 text-sm text-grey">
                              Size {item.size}, {product.colour}
                            </p>
                          </div>
                          <p className="text-sm tabular-nums">{formatPrice(product.price)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-beige">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.slug, item.size, -1)}
                              aria-label={`Decrease quantity of ${product.name}, size ${item.size}`}
                              className="p-2"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.slug, item.size, 1)}
                              aria-label={`Increase quantity of ${product.name}, size ${item.size}`}
                              className="p-2"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.slug, item.size)}
                            className="text-sm underline underline-offset-4"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-beige px-6 py-6">
                  <p className="text-sm text-grey">
                    This is an enquiry list, not a checkout. No payment is taken here. We confirm
                    availability, final price and delivery with you on WhatsApp.
                  </p>
                  <a
                    href={buildWhatsAppUrl(bagEnquiryMessage(lines))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles("primary", "mt-5 w-full")}
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Send enquiry on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={clearBag}
                    className="mt-4 w-full text-center text-sm underline underline-offset-4"
                  >
                    Clear bag
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
