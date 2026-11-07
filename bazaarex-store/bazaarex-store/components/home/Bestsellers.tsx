import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBestsellers } from "@/lib/products";

export function Bestsellers() {
  const products = getBestsellers(4);

  return (
    <section className="py-16 md:py-24" aria-labelledby="bestsellers-title">
      <Container>
        <SectionHeading
          id="bestsellers-title"
          title="Bestsellers"
          description="The pieces our customers come back for."
          actionHref="/shop"
          actionLabel="Shop all"
        />
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </Container>
    </section>
  );
}
