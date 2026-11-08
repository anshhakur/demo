"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BagDrawer } from "@/components/bag/BagDrawer";
import type { BagItem } from "@/types";

const STORAGE_KEY = "bazaarex-enquiry-bag";

interface BagContextValue {
  items: BagItem[];
  count: number;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (slug: string, size: string) => void;
  changeQuantity: (slug: string, size: string, delta: number) => void;
  removeItem: (slug: string, size: string) => void;
  clearBag: () => void;
}

const BagContext = createContext<BagContextValue | null>(null);

function isBagItem(value: unknown): value is BagItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.size === "string" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

/**
 * The bag is an enquiry list, not a checkout. Items are kept in this browser
 * only and are sent to the shop as a WhatsApp message. Nothing is stored on a server.
 */
export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter(isBagItem));
      }
    } catch {
      // Ignore unreadable or blocked storage.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore blocked storage.
    }
  }, [items, loaded]);

  const openBag = useCallback(() => setIsOpen(true), []);
  const closeBag = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((slug: string, size: string) => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === slug && item.size === size);
      if (existing) {
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { slug, size, quantity: 1 }];
    });
  }, []);

  const changeQuantity = useCallback((slug: string, size: string, delta: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.slug === slug && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    setItems((current) => current.filter((item) => !(item.slug === slug && item.size === size)));
  }, []);

  const clearBag = useCallback(() => setItems([]), []);

  const value = useMemo<BagContextValue>(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      isOpen,
      openBag,
      closeBag,
      addItem,
      changeQuantity,
      removeItem,
      clearBag,
    }),
    [items, isOpen, openBag, closeBag, addItem, changeQuantity, removeItem, clearBag],
  );

  return (
    <BagContext.Provider value={value}>
      {children}
      <BagDrawer />
    </BagContext.Provider>
  );
}

export function useBag(): BagContextValue {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag must be used inside <BagProvider>.");
  return context;
}
