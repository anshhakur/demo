"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { useBag } from "@/components/bag/BagProvider";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { count, openBag } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-beige bg-ivory/95 backdrop-blur">
        <div className="mx-auto grid h-16 w-full max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 md:h-20 lg:px-12">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="-ml-3 flex h-11 w-11 items-center justify-center md:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-7 lg:gap-9">
                {siteConfig.nav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "pb-1 text-sm transition-colors hover:text-grey",
                        isActive(link.href) && "border-b border-charcoal",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link
            href="/"
            aria-label={`${siteConfig.name} home`}
            className="font-serif text-xl tracking-[0.24em] sm:text-3xl sm:tracking-[0.3em]"
          >
            {siteConfig.name}
          </Link>

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-11 w-11 items-center justify-center"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={openBag}
              aria-label={`Open enquiry bag, ${count} ${count === 1 ? "item" : "items"}`}
              className="relative -mr-3 flex h-11 w-11 items-center justify-center"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {count > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-charcoal px-1 text-[10px] font-medium leading-none text-ivory">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
