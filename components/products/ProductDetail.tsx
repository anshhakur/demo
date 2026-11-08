"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { useBag } from "@/components/bag/BagProvider";
import { buttonStyles } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";
import type { Product } from "@/types";

type MediaItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string };

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, openBag } = useBag();
  const [activeMedia, setActiveMedia] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);

  const media: MediaItem[] = [
    ...product.images.map((image): MediaItem => ({ type: "image", src: image.src, alt: image.alt })),
    ...(product.video
      ? [{ type: "video", src: product.video, alt: `${product.name}, video` } as MediaItem]
      : []),
  ];
  const current = media[Math.min(activeMedia, media.length - 1)];

  const selectSize = (value: string) => {
    setSize(value);
    setShowSizeError(false);
  };

  const askForSize = () => {
    setShowSizeError(true);
    document.getElementById("size-label")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleAddToBag = () => {
    if (!size) {
      askForSize();
      return;
    }
    addItem(product.slug, size);
    openBag();
  };

  const whatsappHref = buildWhatsAppUrl(productEnquiryMessage(product, size ?? undefined));

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="grid gap-3 sm:grid-cols-[84px_minmax(0,1fr)] sm:gap-4">
          {media.length > 1 ? (
            <div
              className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible"
              role="group"
              aria-label="Product media"
            >
              {media.map((item, index) => (
                <button
                  key={`${item.type}-${item.src}`}
                  type="button"
                  onClick={() => setActiveMedia(index)}
                  aria-label={
                    item.type === "video" ? "Show product video" : `Show image ${index + 1}`
                  }
                  aria-pressed={activeMedia === index}
                  className={cn(
                    "relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-beige/40 sm:w-full",
                    activeMedia === index
                      ? "ring-1 ring-charcoal ring-offset-2 ring-offset-ivory"
                      : "opacity-70 hover:opacity-100",
                  )}
                >
                  {item.type === "image" ? (
                    <Image src={item.src} alt="" fill sizes="84px" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center bg-charcoal text-ivory">
                      <Play className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : null}

          <div className="relative order-1 aspect-[4/5] overflow-hidden bg-beige/40 sm:order-2">
            {current.type === "image" ? (
              <Image
                src={current.src}
                alt={current.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <video
                key={current.src}
                src={current.src}
                poster={product.images[0]?.src}
                controls
                playsInline
                preload="metadata"
                aria-label={current.alt}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="lg:pt-4">
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">{product.name}</h1>
          <p className="mt-3 text-2xl tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-5 max-w-md text-charcoal/80">{product.description}</p>

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
              <button type="button" onClick={askForSize} className={buttonStyles("primary", "w-full")}>
                <WhatsAppIcon className="h-5 w-5" />
                Enquire on WhatsApp
              </button>
            )}
            <button type="button" onClick={handleAddToBag} className={buttonStyles("outline", "w-full")}>
              Add to enquiry bag
            </button>
          </div>
          <p className="mt-4 text-sm text-grey">
            No online payment. We confirm size, stock, final price and delivery with you on WhatsApp.
          </p>

          <div className="mt-10 divide-y divide-beige border-y border-beige">
            <details className="group py-4" open>
              <summary className="flex min-h-6 cursor-pointer list-none items-center justify-between font-medium">
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
              <summary className="flex min-h-6 cursor-pointer list-none items-center justify-between font-medium">
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

      {/* Phone-only enquiry bar. Sticks to the bottom while this product section is on screen. */}
      <div className="sticky bottom-0 z-30 -mx-5 mt-6 border-t border-beige bg-ivory px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:-mx-8 sm:px-8 md:hidden">
        <div className="flex items-center gap-4">
          <p className="text-lg tabular-nums">{formatPrice(product.price)}</p>
          {size ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles("primary", "flex-1")}
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
          ) : (
            <button type="button" onClick={askForSize} className={buttonStyles("primary", "flex-1")}>
              <WhatsAppIcon className="h-5 w-5" />
              Choose a size
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
