"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/types";

const CatalogContext = createContext<Product[]>([]);

export function CatalogProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

/** All products, for client components such as search and the enquiry bag. */
export function useCatalog(): Product[] {
  return useContext(CatalogContext);
}
