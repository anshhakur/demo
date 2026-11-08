import type { Metadata } from "next";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCatalog } from "@/lib/catalog";
import { getNewArrivals } from "@/lib/products";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest pieces to land in store.",
};

export default async function NewArrivalsPage() {
  const catalog = await getCatalog();
  return (
    <>
      <PageHeader title="New arrivals" description="The latest pieces to land in store." />
      <Container className="py-10 md:py-14">
        <ProductGrid products={getNewArrivals(catalog)} priorityCount={4} />
      </Container>
    </>
  );
}
