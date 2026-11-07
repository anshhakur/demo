import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/data/products";
import { getCategoryName, getProductBySlug, getRelatedProducts } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <>
      <Container className="pb-16 pt-6 md:pb-24 md:pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-grey md:mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/shop" className="hover:text-charcoal">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/shop?category=${product.category}`} className="hover:text-charcoal">
                {getCategoryName(product.category)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-charcoal">
              {product.name}
            </li>
          </ol>
        </nav>
        <ProductDetail product={product} />
      </Container>

      <section className="border-t border-beige py-16 md:py-24" aria-labelledby="related-title">
        <Container>
          <SectionHeading id="related-title" title="You may also like" />
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </Container>
      </section>
    </>
  );
}
