"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}

export function MobileMenu({ open, onClose, isActive }: MobileMenuProps) {
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

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <motion.div
            className="absolute inset-0 bg-charcoal/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-ivory px-6 pb-8 pt-5"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.3em]">{siteConfig.name}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="-mr-2 p-2"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-10">
              <ul className="divide-y divide-beige border-y border-beige">
                {siteConfig.nav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "block py-4 font-serif text-3xl",
                        isActive(link.href) ? "text-charcoal" : "text-charcoal/70",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={buildWhatsAppUrl(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-3 text-sm font-medium"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat with us on WhatsApp
            </a>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
