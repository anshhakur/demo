"use client";

import Image from "next/image";
import { useState } from "react";
import { useBag } from "@/components/bag/BagProvider";
import { buttonStyles } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";
import type { Product } from "@/types";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, openBag } = useBag();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);

  const selectSize = (value: string) => {
    setSize(value);
    setShowSizeError(false);
  };

  const handleAddToBag = () => {
    if (!size) {
      setShowSizeError(true);
      return;
    }
    addItem(product.slug, size);
    openBag();
  };

  const whatsappHref = buildWhatsAppUrl(productEnquiryMessage(product, size ?? undefined));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      <div className="grid gap-3 sm:grid-cols-[84px_minmax(0,1fr)] sm:gap-4">
        <div className="order-2 flex gap-3 sm:order-1 sm:flex-col" role="group" aria-label="Product images">
          {product.images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`Show image ${index + 1} of ${product.images.length}`}
              aria-pressed={activeImage === index}
              className={cn(
                "relative aspect-[4/5] w-20 overflow-hidden bg-beige/40 sm:w-full",
                activeImage === index ? "ring-1 ring-charcoal ring-offset-2 ring-offset-ivory" : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image.src} alt="" fill sizes="84px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="relative order-1 aspect-[4/5] overflow-hidden bg-beige/40 sm:order-2">
          <Image
            src={product.images[activeImage].src}
            alt={product.images[activeImage].alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="lg:pt-4">
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">{product.name}</h1>
        <p className="mt-4 text-2xl tabular-nums">{formatPrice(product.price)}</p>
        <p className="mt-6 max-w-md text-charcoal/80">{product.description}</p>

        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <p id="size-label" className="text-sm font-medium">
              Size
            </p>
            <p className="text-sm text-grey">Colour: {product.colour}</p>
          </div>
          <div role="radiogroup" aria-labelledby="size-label" className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={size === value}
                onClick={() => selectSize(value)}
                className={cn(
                  "h-12 min-w-12 border px-4 text-sm transition-colors",
                  size === value
                    ? "border-charcoal bg-charcoal text-ivory"
                    : "border-beige bg-white hover:border-charcoal",
                )}
              >
                {value}
              </button>
            ))}
          </div>
          {showSizeError ? (
            <p role="alert" className="mt-3 text-sm font-medium">
              Choose a size first.
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {size ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles("primary", "w-full")}
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setShowSizeError(true)}
              className={buttonStyles("primary", "w-full")}
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire on WhatsApp
            </button>
          )}
          <button
            type="button"
            onClick={handleAddToBag}
            className={buttonStyles("outline", "w-full")}
          >
            Add to enquiry bag
          </button>
        </div>
        <p className="mt-4 text-sm text-grey">
          No online payment. We confirm size, stock, final price and delivery with you on WhatsApp.
        </p>

        <div className="mt-10 divide-y divide-beige border-y border-beige">
          <details className="group py-4" open>
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              Details
              <span aria-hidden="true" className="text-xl leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-charcoal/80">
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </details>
          <details className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              Fabric and care
              <span aria-hidden="true" className="text-xl leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 text-charcoal/80">{product.fabric}</p>
          </details>
        </div>
      </div>
    </div>
  );
}
