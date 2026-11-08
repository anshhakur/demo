import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCatalog } from "@/lib/catalog";
import { getNewArrivals } from "@/lib/products";

export async function NewArrivals() {
  const products = getNewArrivals(await getCatalog(), 8);
  if (products.length === 0) return null;

  return (
    <section className="pb-14 pt-4 md:pb-24 md:pt-0" aria-labelledby="new-arrivals-title">
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
