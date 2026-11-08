import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getCategoryName } from "@/lib/products";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const primary = product.images[0];
  const secondary = product.images[1];

  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="block"
        aria-label={`${product.name}, ${formatPrice(product.price)}. View product`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-beige/40">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
          />
          {secondary ? (
            <Image
              src={secondary.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          ) : null}
          {product.isNew ? (
            <span className="absolute left-3 top-3 bg-ivory px-2.5 py-1 text-xs font-medium">
              New
            </span>
          ) : null}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-charcoal py-3 text-center text-sm text-ivory transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0 md:block"
          >
            View product
          </span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-grey">{getCategoryName(product.category)}</p>
            <h3 className="mt-0.5 text-[15px] font-medium leading-snug">{product.name}</h3>
          </div>
          <p className="shrink-0 text-[15px] tabular-nums">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
