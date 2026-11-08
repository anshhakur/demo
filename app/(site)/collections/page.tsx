import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { collections } from "@/data/collections";
import { getCatalog } from "@/lib/catalog";
import { getCollectionProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Collections",
  description: "Edited groups of pieces that work well together.",
};

export default async function CollectionsPage() {
  const catalog = await getCatalog();
  return (
    <>
      <PageHeader
        title="Collections"
        description="Edited groups of pieces that work well together."
      />
      <Container className="py-10 md:py-14">
        <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {collections.map((collection, index) => (
            <li key={collection.slug} className={index === 0 ? "md:col-span-2" : undefined}>
              <Link href={`/collections/${collection.slug}`} className="group block">
                <div
                  className={
                    index === 0
                      ? "relative aspect-[3/2] overflow-hidden bg-beige/40 md:aspect-[2/1]"
                      : "relative aspect-[3/2] overflow-hidden bg-beige/40"
                  }
                >
                  <Image
                    src={collection.image}
                    alt={`${collection.name} collection`}
                    fill
                    priority={index === 0}
                    sizes={index === 0 ? "(min-width: 1320px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <h2 className="mt-5 font-serif text-3xl md:text-4xl">{collection.name}</h2>
                <p className="mt-2 max-w-xl text-grey">{collection.description}</p>
                <p className="mt-3 text-sm font-medium underline underline-offset-8 group-hover:decoration-2">
                  View {getCollectionProducts(catalog, collection).length} pieces
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
