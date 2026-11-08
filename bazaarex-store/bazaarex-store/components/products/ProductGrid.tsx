import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  /** Number of leading cards to load eagerly (above the fold). */
  priorityCount?: number;
}

export function ProductGrid({ products, priorityCount = 0 }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
      {products.map((product, index) => (
        <li key={product.slug}>
          <ProductCard product={product} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
