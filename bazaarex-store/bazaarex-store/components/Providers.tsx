"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { BagProvider } from "@/components/bag/BagProvider";
import { CatalogProvider } from "@/components/CatalogProvider";
import type { Product } from "@/types";

export function Providers({ products, children }: { products: Product[]; children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CatalogProvider products={products}>
        <BagProvider>{children}</BagProvider>
      </CatalogProvider>
    </MotionConfig>
  );
}
