/**
 * Store-wide settings. Edit this file to change the name, contact details,
 * announcement text and navigation. Nothing here is connected to a real
 * backend, inventory system or payment provider.
 */
export const siteConfig = {
  name: "BAZAAREX",
  tagline: "Style That Speaks",
  description:
    "BAZAAREX is a modern clothing store for shirts, knitwear, trousers and jackets in honest fabrics. Browse the collection and order through WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** International format, digits only. Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999",
  announcement:
    "Order on WhatsApp. We confirm size, stock and delivery with you directly.",
  contact: {
    address: "Your shop address, City, State, PIN",
    phone: "+91 99999 99999",
    email: "hello@bazaarex.example",
    hours: "Open daily, 10:00 am to 9:00 pm",
  },
  socials: {
    instagram: "https://instagram.com/your-store-handle",
    facebook: "https://facebook.com/your-store-page",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
  ],
} as const;
