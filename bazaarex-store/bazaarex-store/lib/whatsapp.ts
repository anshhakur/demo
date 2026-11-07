import { siteConfig } from "@/data/site";
import { formatPrice } from "@/lib/format";
import type { BagItem, Product } from "@/types";

/** Builds a wa.me link with a prefilled message. */
export function buildWhatsAppUrl(message: string): string {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function generalEnquiryMessage(): string {
  return `Hi ${siteConfig.name}, I'd like some help choosing something from your store.`;
}

export function productEnquiryMessage(product: Product, size?: string): string {
  const lines = [
    `Hi ${siteConfig.name}, I'd like to enquire about this item:`,
    "",
    `Product: ${product.name}`,
    `Colour: ${product.colour}`,
    size ? `Size: ${size}` : null,
    `Price: ${formatPrice(product.price)}`,
    `Link: ${siteConfig.url}/products/${product.slug}`,
    "",
    "Is it available?",
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

export function bagEnquiryMessage(
  lines: Array<{ product: Product; item: BagItem }>,
): string {
  const rows = lines.map(
    ({ product, item }, index) =>
      `${index + 1}. ${product.name} | Size ${item.size} | Qty ${item.quantity} | ${formatPrice(product.price)}`,
  );
  return [
    `Hi ${siteConfig.name}, I'd like to enquire about these items:`,
    "",
    ...rows,
    "",
    "Please confirm availability and delivery.",
  ].join("\n");
}
