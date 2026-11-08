import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { getCollection } from "@/lib/products";

export function FeaturedCollection() {
  const collection = getCollection("layering-edit");
  if (!collection) return null;

  return (
    <section aria-labelledby="featured-collection-title">
      <div className="grid bg-charcoal text-ivory lg:grid-cols-2" data-theme="dark">
        <div className="flex flex-col justify-center px-5 py-14 sm:px-10 md:py-20 lg:px-16 xl:px-24">
          <h2 id="featured-collection-title" className="font-serif text-5xl leading-none md:text-7xl">
            {collection.name}
          </h2>
          <p className="mt-6 max-w-md text-lg text-ivory/75">{collection.description}</p>
          <div className="mt-9">
            <ButtonLink href={`/collections/${collection.slug}`} variant="light">
              Shop the collection
            </ButtonLink>
          </div>
        </div>
        <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[560px]">
          <Image
            src={collection.image}
            alt="A taupe knit, a mocha overshirt jacket and a sage shirt laid out together"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
