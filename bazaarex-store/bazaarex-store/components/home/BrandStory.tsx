import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function BrandStory() {
  return (
    <section className="pb-16 md:pb-24" aria-labelledby="brand-story-title">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-beige/40 md:max-w-none">
          <Image
            src="/images/about/story.svg"
            alt="A charcoal knit and stone trousers in front of an arched backdrop"
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-lg">
          <h2 id="brand-story-title" className="font-serif text-4xl leading-tight md:text-6xl">
            Made to be worn on repeat.
          </h2>
          <p className="mt-6 text-lg text-charcoal/80">
            BAZAAREX is a clothing store built around pieces that last longer than a season: honest
            fabrics, easy cuts and quiet colours that work with what you already own.
          </p>
          <p className="mt-4 text-charcoal/80">
            Every item is chosen by hand and every order is handled in conversation, so you get real
            answers about fit and availability.
          </p>
          <div className="mt-8">
            <ButtonLink href="/about" variant="outline">
              Read our story
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
