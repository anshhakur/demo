# BAZAAREX store

A premium, mobile-first clothing store website built with Next.js (App Router), TypeScript,
Tailwind CSS, Framer Motion and Lucide icons.

This is a catalogue and WhatsApp-enquiry site. **It has no payment processing, no inventory
system and no order storage.** Customers browse, pick a size and send an enquiry to your
WhatsApp number. You confirm stock, price and delivery with them directly.

## Run it locally

```bash
npm install
cp .env.example .env.local     # then edit the values
npm run dev                    # http://localhost:3000
```

With no Supabase values set, the store runs on the sample products in `data/products.ts` and the
admin page is switched off. Run `npm run typecheck` and `npm run build` before deploying.

## Go live (Supabase + Vercel)

Products, photos and videos are stored in **Supabase**. The site is hosted on **Vercel**.

### 1. Supabase (5 minutes)
1. Create a project at supabase.com.
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it. This creates the
   `products` table and a public `media` storage bucket.
3. Open **Project Settings > API** and copy the Project URL, the `anon` public key, and the
   `service_role` secret key.

### 2. Push the code to GitHub
```bash
git init && git add . && git commit -m "BAZAAREX store"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/bazaarex-store.git
git push -u origin main
```

### 3. Deploy on Vercel
1. At vercel.com choose **Add New > Project** and import the GitHub repo. Framework: Next.js (automatic).
2. Before clicking Deploy, open **Environment Variables** and add every variable from `.env.example`:
   `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL` (your Vercel URL, you can fix it after the
   first deploy), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PATH`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
3. Click **Deploy**. Your link looks like `https://bazaarex-store.vercel.app`.

(Or with the CLI: `npm i -g vercel`, then `vercel` and `vercel --prod`.)

## Admin: add and remove products

Open `https://<your-site>/admin/<ADMIN_PATH>` and enter `ADMIN_PASSWORD`. Bookmark it on your phone.

- **Add a product:** fill in the form, choose photos from your phone (and optionally a video up to
  50 MB), then tap *Add product to store*. It goes live straight away.
- **Remove a product:** tap the bin icon next to it. Its uploaded photos and video are deleted too.
- **First time:** tap *Load sample products* to copy the sample range into your database, then
  remove what you don't need.

Security notes: the admin address is secret and also protected by a password. Anyone without both
sees a normal "page not found". Keep `ADMIN_PATH`, `ADMIN_PASSWORD` and the Supabase service key
private, and never commit `.env.local`. Photos are resized on your phone before upload.

## Replace the sample content

All sample content lives in `data/` and is kept separate from the UI.

| File | What it controls |
| --- | --- |
| `data/products.ts` | Sample products, used until Supabase is connected (afterwards manage products in the admin page) |
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
app/(site)/             Store pages (home, shop, products/[slug], collections, about)
  admin/[key]/          Secret admin page
  api/admin/            Admin API (login, upload URLs, add/remove products)
components/
  layout/               Announcement bar, header, mobile menu, search dialog, footer
  home/                 Homepage sections (hero, categories, new arrivals, ...)
  products/             Product card, grid, detail page, shop filters
  bag/                  Enquiry bag (state + drawer)
  admin/                Admin login and dashboard
  ui/                   Buttons, container, headings, icons
data/                   Sample products, categories, collections, site settings
lib/                    Formatting, product helpers, WhatsApp link builders
types/                  TypeScript types
public/images/          Image assets
public/videos/          Homepage film (runway.mp4 + poster)
supabase/schema.sql     Database and storage setup
```

## How the enquiry bag works

The bag icon opens an **enquiry list**. Items are saved in the visitor's browser only
(`localStorage`) and are never sent to a server. "Send enquiry on WhatsApp" opens WhatsApp with
a prefilled message listing the items, sizes and prices.

## Notes

- Fonts (Instrument Serif and Figtree) are loaded with `next/font/google`, so the first build
  needs internet access.
- Prices use the Indian rupee. To change currency, edit `lib/format.ts`.
