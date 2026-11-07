import type { Metadata } from "next";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getNewArrivals } from "@/lib/products";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest pieces to land in store.",
};

export default function NewArrivalsPage() {
  return (
    <>
      <PageHeader title="New arrivals" description="The latest pieces to land in store." />
      <Container className="py-10 md:py-14">
        <ProductGrid products={getNewArrivals()} priorityCount={4} />
      </Container>
    </>
  );
}
