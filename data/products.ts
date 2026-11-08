import type { Product } from "@/types";

/**
 * SAMPLE PRODUCT DATA. Replace everything in this file with your real stock.
 *
 * To add real photos: drop the files in /public/images/products/ and point
 * each product's `images` at them. Use 4:5 portrait photos (for example
 * 1200 x 1500). The first image is the main shot, the second appears on hover.
 *
 * Prices are whole rupees. Nothing here is connected to inventory.
 */

const clothingSizes = ["S", "M", "L", "XL"];
const trouserSizes = ["28", "30", "32", "34", "36"];

function images(slug: string, name: string): Product["images"] {
  return [
    { src: `/images/products/${slug}-front.svg`, alt: `${name}, front view` },
    { src: `/images/products/${slug}-detail.svg`, alt: `${name}, close-up detail` },
  ];
}

export const products: Product[] = [
  {
    id: "p-001",
    slug: "linen-camp-collar-shirt",
    name: "Linen Camp Collar Shirt",
    price: 2490,
    category: "shirts",
    description:
      "A relaxed short-collar shirt in washed linen. It sits loose through the body and softens with every wash.",
    details: ["Relaxed fit", "Open camp collar", "Corozo-style buttons", "Straight hem"],
    fabric: "100% washed linen. Machine wash cold, line dry.",
    colour: "Oat",
    sizes: clothingSizes,
    images: images("linen-camp-collar-shirt", "Linen Camp Collar Shirt"),
    isNew: true,
  },
  {
    id: "p-002",
    slug: "poplin-everyday-shirt",
    name: "Poplin Everyday Shirt",
    price: 2290,
    category: "shirts",
    description:
      "A crisp cotton poplin shirt with a clean collar. Wear it tucked in for work or open over a tee.",
    details: ["Regular fit", "Spread collar", "Single chest pocket", "Curved hem"],
    fabric: "100% cotton poplin. Machine wash warm, iron on medium.",
    colour: "Bone",
    sizes: clothingSizes,
    images: images("poplin-everyday-shirt", "Poplin Everyday Shirt"),
    isBestseller: true,
  },
  {
    id: "p-003",
    slug: "washed-oxford-shirt",
    name: "Washed Oxford Shirt",
    price: 2690,
    category: "shirts",
    description:
      "A garment-washed oxford with a soft hand from day one. The muted sage colour pairs with almost everything.",
    details: ["Regular fit", "Button-down collar", "Garment washed", "Back box pleat"],
    fabric: "100% cotton oxford. Machine wash cold.",
    colour: "Sage",
    sizes: clothingSizes,
    images: images("washed-oxford-shirt", "Washed Oxford Shirt"),
    isNew: true,
  },
  {
    id: "p-004",
    slug: "heavyweight-crew-tee",
    name: "Heavyweight Crew Tee",
    price: 1190,
    category: "t-shirts",
    description:
      "A dense, structured tee that drapes cleanly and keeps its shape wash after wash.",
    details: ["Boxy fit", "Ribbed crew neck", "240 gsm jersey", "Pre-shrunk"],
    fabric: "100% combed cotton. Machine wash cold, tumble low.",
    colour: "Charcoal",
    sizes: clothingSizes,
    images: images("heavyweight-crew-tee", "Heavyweight Crew Tee"),
    isBestseller: true,
  },
  {
    id: "p-005",
    slug: "organic-cotton-tee",
    name: "Organic Cotton Tee",
    price: 990,
    category: "t-shirts",
    description:
      "A lighter everyday tee in soft organic cotton. A clean base layer in an easy off-white.",
    details: ["Regular fit", "Ribbed crew neck", "Soft jersey", "Tubular body"],
    fabric: "100% organic cotton. Machine wash cold.",
    colour: "Bone",
    sizes: clothingSizes,
    images: images("organic-cotton-tee", "Organic Cotton Tee"),
    isBestseller: true,
  },
  {
    id: "p-006",
    slug: "pocket-tee",
    name: "Pocket Tee",
    price: 1090,
    category: "t-shirts",
    description:
      "The classic pocket tee in a warm taupe. Mid-weight cotton with a slightly longer body.",
    details: ["Relaxed fit", "Patch chest pocket", "Mid-weight jersey", "Longer body"],
    fabric: "100% cotton. Machine wash cold.",
    colour: "Taupe",
    sizes: clothingSizes,
    images: images("pocket-tee", "Pocket Tee"),
    isNew: true,
  },
  {
    id: "p-007",
    slug: "pleated-wide-trousers",
    name: "Pleated Wide Trousers",
    price: 3490,
    category: "trousers",
    description:
      "A wide-leg trouser with a double pleat and a high, comfortable rise. Falls straight to the ankle.",
    details: ["Wide leg", "Double forward pleat", "Side adjusters", "Zip fly"],
    fabric: "Cotton-viscose twill. Dry clean or gentle machine wash.",
    colour: "Charcoal",
    sizes: trouserSizes,
    images: images("pleated-wide-trousers", "Pleated Wide Trousers"),
    isNew: true,
  },
  {
    id: "p-008",
    slug: "straight-cotton-chino",
    name: "Straight Cotton Chino",
    price: 2890,
    category: "trousers",
    description:
      "A straight-leg chino in stone cotton twill. Easy through the thigh with a clean break at the shoe.",
    details: ["Straight leg", "Mid rise", "Slant pockets", "Zip fly"],
    fabric: "98% cotton, 2% elastane twill. Machine wash cold.",
    colour: "Stone",
    sizes: trouserSizes,
    images: images("straight-cotton-chino", "Straight Cotton Chino"),
    isBestseller: true,
  },
  {
    id: "p-009",
    slug: "drawcord-linen-trousers",
    name: "Drawcord Linen Trousers",
    price: 2990,
    category: "trousers",
    description:
      "Light, breathable linen trousers with an elasticated drawcord waist for all-day comfort.",
    details: ["Relaxed leg", "Drawcord waist", "Side pockets", "Tapered ankle"],
    fabric: "100% linen. Machine wash cold, line dry.",
    colour: "Oat",
    sizes: trouserSizes,
    images: images("drawcord-linen-trousers", "Drawcord Linen Trousers"),
    isNew: true,
  },
  {
    id: "p-010",
    slug: "unlined-overshirt-jacket",
    name: "Unlined Overshirt Jacket",
    price: 4990,
    category: "jackets",
    description:
      "A structured overshirt that works as a light jacket. Heavy cotton canvas in a deep mocha.",
    details: ["Regular fit", "Concealed placket", "Two flap pockets", "Unlined"],
    fabric: "100% cotton canvas. Machine wash cold.",
    colour: "Mocha",
    sizes: clothingSizes,
    images: images("unlined-overshirt-jacket", "Unlined Overshirt Jacket"),
    isNew: true,
  },
  {
    id: "p-011",
    slug: "coach-jacket",
    name: "Coach Jacket",
    price: 4490,
    category: "jackets",
    description:
      "A lightweight snap-front coach jacket with a clean collar. Slate grey, water-resistant finish.",
    details: ["Regular fit", "Snap front", "Two welt pockets", "Light lining"],
    fabric: "Cotton-nylon blend with water-resistant finish. Spot clean.",
    colour: "Slate",
    sizes: clothingSizes,
    images: images("coach-jacket", "Coach Jacket"),
    isBestseller: true,
  },
  {
    id: "p-012",
    slug: "light-field-jacket",
    name: "Light Field Jacket",
    price: 5490,
    category: "jackets",
    description:
      "A field jacket stripped back to the essentials. Four pockets, a stand collar and a soft sage finish.",
    details: ["Regular fit", "Stand collar", "Four pockets", "Zip and snap front"],
    fabric: "Cotton ripstop. Machine wash cold, hang dry.",
    colour: "Sage",
    sizes: clothingSizes,
    images: images("light-field-jacket", "Light Field Jacket"),
    isNew: true,
  },
  {
    id: "p-013",
    slug: "merino-crew-knit",
    name: "Merino Crew Knit",
    price: 3990,
    category: "knitwear",
    description:
      "A fine-gauge merino crew that layers under a jacket or stands alone. Warm without the bulk.",
    details: ["Regular fit", "Fine gauge", "Ribbed neck, cuffs and hem", "Naturally breathable"],
    fabric: "100% merino wool. Hand wash cold, dry flat.",
    colour: "Taupe",
    sizes: clothingSizes,
    images: images("merino-crew-knit", "Merino Crew Knit"),
    isNew: true,
  },
  {
    id: "p-014",
    slug: "ribbed-cotton-knit",
    name: "Ribbed Cotton Knit",
    price: 3290,
    category: "knitwear",
    description:
      "A textured ribbed cotton knit with a soft, matte finish. A year-round alternative to wool.",
    details: ["Relaxed fit", "Rib-knit body", "Dropped shoulder", "Ribbed trims"],
    fabric: "100% cotton. Machine wash cold on a gentle cycle, dry flat.",
    colour: "Bone",
    sizes: clothingSizes,
    images: images("ribbed-cotton-knit", "Ribbed Cotton Knit"),
    isBestseller: true,
  },
  {
    id: "p-015",
    slug: "textured-crew-knit",
    name: "Textured Crew Knit",
    price: 4290,
    category: "knitwear",
    description:
      "A heavier, textured crew in charcoal with a slightly cropped body. Made for layering over shirts.",
    details: ["Relaxed fit", "Textured stitch", "Dropped shoulder", "Slightly shorter body"],
    fabric: "Wool-cotton blend. Hand wash cold, dry flat.",
    colour: "Charcoal",
    sizes: clothingSizes,
    images: images("textured-crew-knit", "Textured Crew Knit"),
    isBestseller: true,
  },
  {
    id: "p-016",
    slug: "waffle-cotton-knit",
    name: "Waffle Cotton Knit",
    price: 3490,
    category: "knitwear",
    description:
      "A waffle-stitch cotton knit in warm oat. Light enough for mild evenings, with texture that shows.",
    details: ["Regular fit", "Waffle stitch", "Crew neck", "Ribbed cuffs"],
    fabric: "100% cotton. Machine wash cold on a gentle cycle, dry flat.",
    colour: "Oat",
    sizes: clothingSizes,
    images: images("waffle-cotton-knit", "Waffle Cotton Knit"),
    isBestseller: true,
  },
];
