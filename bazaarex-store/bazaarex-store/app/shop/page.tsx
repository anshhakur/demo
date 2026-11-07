import type { Metadata } from "next";
import { ShopBrowser } from "@/components/products/ShopBrowser";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { categories } from "@/data/categories";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse shirts, t-shirts, trousers, jackets and knitwear.",
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, q } = await searchParams;

  return (
    <>
      <PageHeader
        title="Shop"
        description="Every piece in store. Filter by category, or search by name and colour."
      />
      <Container className="py-10 md:py-14">
        <ShopBrowser
          products={getAllProducts()}
          categories={categories}
          initialCategory={category}
          initialQuery={q}
        />
      </Container>
    </>
  );
}
