import type { Collection } from "@/types";

/** Sample collections. Replace with your own edits and seasonal drops. */
export const collections: Collection[] = [
  {
    slug: "layering-edit",
    name: "The Layering Edit",
    description:
      "Knits, overshirts and light jackets chosen to work together. Build an outfit that handles a warm afternoon and a cool night.",
    image: "/images/collections/layering-edit.svg",
    productSlugs: [
      "merino-crew-knit",
      "unlined-overshirt-jacket",
      "washed-oxford-shirt",
      "light-field-jacket",
      "textured-crew-knit",
      "coach-jacket",
    ],
  },
  {
    slug: "linen-edit",
    name: "The Linen Edit",
    description:
      "Breathable linen shirts and trousers in earthy tones. Made for long, warm days.",
    image: "/images/collections/linen-edit.svg",
    productSlugs: [
      "linen-camp-collar-shirt",
      "drawcord-linen-trousers",
      "poplin-everyday-shirt",
      "organic-cotton-tee",
    ],
  },
  {
    slug: "everyday-essentials",
    name: "Everyday Essentials",
    description:
      "The pieces you reach for first. Tees, chinos and knits in a palette that always matches.",
    image: "/images/collections/everyday-essentials.svg",
    productSlugs: [
      "heavyweight-crew-tee",
      "pocket-tee",
      "straight-cotton-chino",
      "ribbed-cotton-knit",
      "pleated-wide-trousers",
      "waffle-cotton-knit",
    ],
  },
];
