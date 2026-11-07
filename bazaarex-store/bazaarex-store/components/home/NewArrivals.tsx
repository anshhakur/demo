import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getNewArrivals } from "@/lib/products";

export function NewArrivals() {
  const products = getNewArrivals(8);

  return (
    <section className="pb-16 md:pb-24" aria-labelledby="new-arrivals-title">
      <Container>
        <SectionHeading
          id="new-arrivals-title"
          title="New arrivals"
          description="The latest pieces to land in store."
          actionHref="/new-arrivals"
          actionLabel="View all new arrivals"
        />
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </Container>
    </section>
  );
}
