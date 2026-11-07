import type { Metadata } from "next";
import Image from "next/image";
import { WhatsAppCta } from "@/components/home/WhatsAppCta";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About BAZAAREX"
        description="A clothing store for people who want fewer, better pieces."
      />
      <Container className="grid gap-12 py-14 md:grid-cols-2 md:gap-20 md:py-20">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-beige/40 md:max-w-none">
          <Image
            src="/images/about/story.svg"
            alt="A charcoal knit and stone trousers in front of an arched backdrop"
            fill
            priority
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-lg self-center">
          {/* Replace this copy with your own shop's story. */}
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            Honest fabrics. Easy cuts. Quiet colours.
          </h2>
          <p className="mt-6 text-lg text-charcoal/80">
            {siteConfig.name} started with a simple idea: clothes should be easy to choose and easy
            to live in. We pick shirts, knits, trousers and jackets that fit well, wash well and
            work together.
          </p>
          <p className="mt-4 text-charcoal/80">
            We keep the range small on purpose. Each piece is chosen by hand, and we talk to every
            customer directly on WhatsApp, so you get a straight answer about size, fabric and
            availability before you decide.
          </p>
          <p className="mt-4 text-charcoal/80">
            Visit the shop, or message us any time. We&rsquo;re happy to help you build an outfit
            from what&rsquo;s in store.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/shop">Shop the collection</ButtonLink>
            <ButtonLink href="/collections" variant="ghost">
              Browse collections
            </ButtonLink>
          </div>
        </div>
      </Container>
      <WhatsAppCta />
    </>
  );
}
