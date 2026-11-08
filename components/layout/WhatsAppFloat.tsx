"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";

/** A phone-only shortcut to WhatsApp. Hidden on product pages, which have their own enquiry bar. */
export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/products/")) return null;

  return (
    <a
      href={buildWhatsAppUrl(generalEnquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-ivory shadow-lg md:hidden"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
