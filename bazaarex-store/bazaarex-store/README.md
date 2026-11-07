# BAZAAREX store

A premium, mobile-first clothing store website built with Next.js (App Router), TypeScript,
Tailwind CSS, Framer Motion and Lucide icons.

This is a catalogue and WhatsApp-enquiry site. **It has no payment processing, no inventory
system and no order storage.** Customers browse, pick a size and send an enquiry to your
WhatsApp number. You confirm stock, price and delivery with them directly.

## Run it

```bash
npm install
cp .env.example .env.local     # then edit the values
npm run dev                    # http://localhost:3000
```

Before deploying, run `npm run typecheck` and `npm run build`.

## Set up your details

1. **WhatsApp number**: set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (international format,
   digits only, for example `919876543210`).
2. **Site URL**: set `NEXT_PUBLIC_SITE_URL` to your live domain once deployed. It is used in
   metadata and in the product links inside WhatsApp messages.
3. **Shop details**: edit `data/site.ts` (address, phone, email, hours, social links, the
   announcement bar text, navigation).

## Replace the sample content

All sample content lives in `data/` and is kept separate from the UI.

| File | What it controls |
| --- | --- |
| `data/products.ts` | Products: name, price (whole rupees), category, sizes, descriptions, images |
| `data/categories.ts` | Shop-by-category cards and filter chips |
| `data/collections.ts` | Collections and the featured homepage banner (`layering-edit`) |
| `data/site.ts` | Store name, contact details, WhatsApp number, navigation |

### Adding real photos

The images in `public/images/` are **generated placeholders** (simple garment illustrations),
not photographs. To use your real photos:

1. Put the files in `public/images/products/` (use 4:5 portrait shots, for example 1200 x 1500).
2. In `data/products.ts`, change each product's `images` to point at your files. The first image
   is the main shot, the second is shown on hover and as the second gallery image.
3. Replace the category, collection, hero and about images the same way (paths are in
   `data/categories.ts`, `data/collections.ts`, `components/home/Hero.tsx` and
   `components/home/BrandStory.tsx`).
4. When you are done, you can delete `scripts/generate-placeholders.mjs`.

Tip: shoot all products on the same neutral backdrop with the same lighting and framing so the
grid looks consistent.

## Project structure

```
app/                    Pages and layouts (home, shop, products/[slug], collections, about)
components/
  layout/               Announcement bar, header, mobile menu, search dialog, footer
  home/                 Homepage sections (hero, categories, new arrivals, ...)
  products/             Product card, grid, detail page, shop filters
  bag/                  Enquiry bag (state + drawer)
  ui/                   Buttons, container, headings, icons
data/                   Sample products, categories, collections, site settings
lib/                    Formatting, product helpers, WhatsApp link builders
types/                  TypeScript types
public/images/          Image assets
```

## How the enquiry bag works

The bag icon opens an **enquiry list**. Items are saved in the visitor's browser only
(`localStorage`) and are never sent to a server. "Send enquiry on WhatsApp" opens WhatsApp with
a prefilled message listing the items, sizes and prices.

## Notes

- Fonts (Instrument Serif and Figtree) are loaded with `next/font/google`, so the first build
  needs internet access.
- Prices use the Indian rupee. To change currency, edit `lib/format.ts`.
