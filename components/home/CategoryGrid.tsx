import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/categories";
import { getCatalog } from "@/lib/catalog";
import { countInCategory } from "@/lib/products";

export async function CategoryGrid() {
  const catalog = await getCatalog();
  return (
    <section className="py-14 md:py-24" aria-labelledby="categories-title">
      <Container>
        <SectionHeading
          id="categories-title"
          title="Shop by category"
          description="Start with the piece you need and build from there."
          actionHref="/shop"
          actionLabel="View everything"
        />
        <ul className="-mx-5 mt-10 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-5 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {categories.map((category) => {
            const total = countInCategory(catalog, category.slug);
            return (
              <li key={category.slug} className="w-[62%] shrink-0 snap-start sm:w-[44%] md:w-auto">
                <Link href={`/shop?category=${category.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-beige/40">
                    <Image
                      src={category.image}
                      alt={`${category.name} category`}
                      fill
                      sizes="(min-width: 768px) 20vw, 62vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-2xl">{category.name}</h3>
                    <p className="text-sm text-grey">{total} styles</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
