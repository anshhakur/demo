import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCatalog } from "@/lib/catalog";
import { getBestsellers } from "@/lib/products";

export async function Bestsellers() {
  const products = getBestsellers(await getCatalog(), 4);
  if (products.length === 0) return null;

  return (
    <section className="py-14 md:py-24" aria-labelledby="bestsellers-title">
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
