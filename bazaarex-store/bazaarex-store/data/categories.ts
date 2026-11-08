import type { Category } from "@/types";

/** Replace the image paths with real category photos when you have them. */
export const categories: Category[] = [
  {
    slug: "shirts",
    name: "Shirts",
    description: "Linen, poplin and oxford cuts for every day.",
    image: "/images/categories/shirts.svg",
  },
  {
    slug: "t-shirts",
    name: "T-Shirts",
    description: "Heavy cotton tees that keep their shape.",
    image: "/images/categories/t-shirts.svg",
  },
  {
    slug: "trousers",
    name: "Trousers",
    description: "Easy, well-cut trousers in quiet colours.",
    image: "/images/categories/trousers.svg",
  },
  {
    slug: "jackets",
    name: "Jackets",
    description: "Light layers for cooler evenings.",
    image: "/images/categories/jackets.svg",
  },
  {
    slug: "knitwear",
    name: "Knitwear",
    description: "Soft knits in merino and cotton.",
    image: "/images/categories/knitwear.svg",
  },
];
