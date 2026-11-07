import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { collections } from "@/data/collections";
import { getCollection, getCollectionProducts } from "@/lib/products";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return { title: collection.name, description: collection.description };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = getCollectionProducts(collection);

  return (
    <>
      <PageHeader title={collection.name} description={collection.description}>
        <nav aria-label="Breadcrumb" className="mt-8 text-sm text-grey">
          <Link href="/collections" className="underline underline-offset-4 hover:text-charcoal">
            All collections
          </Link>
        </nav>
      </PageHeader>
      <Container className="py-10 md:py-14">
        <ProductGrid products={items} priorityCount={4} />
      </Container>
    </>
  );
}
