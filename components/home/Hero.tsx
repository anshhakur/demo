"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/** The one orchestrated moment on the page: text and collage arrive in sequence. */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const reveal: Variants = {
  hidden: { opacity: 0, scale: 1.03 },
  show: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
};

export function Hero() {
  return (
    <section className="overflow-x-clip" aria-labelledby="hero-title">
      <Container className="grid items-center gap-12 py-10 md:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:py-20">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.h1
            id="hero-title"
            variants={rise}
            className="font-serif text-[clamp(3.75rem,11vw,8rem)] leading-[0.9] tracking-tight"
          >
            Style That
            <br />
            Speaks.
          </motion.h1>
          <motion.p variants={rise} className="mt-7 max-w-md text-lg text-charcoal/80">
            Shirts, knitwear, trousers and light jackets in honest fabrics and a palette that works
            with everything you already own.
          </motion.p>
          <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/shop">Explore Collection</ButtonLink>
            <ButtonLink href="/new-arrivals" variant="ghost">
              See what&rsquo;s new
            </ButtonLink>
          </motion.div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
          <div className="grid grid-cols-[1.35fr_1fr] grid-rows-2 gap-3 sm:gap-4">
            <motion.div
              variants={reveal}
              className="relative row-span-2 aspect-[4/5] overflow-hidden bg-beige"
            >
              <Image
                src="/images/hero/hero-main.svg"
                alt="A mocha overshirt jacket on a neutral studio backdrop"
                fill
                priority
                sizes="(min-width: 1024px) 34vw, 58vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div variants={reveal} className="relative overflow-hidden bg-beige">
              <Image
                src="/images/hero/hero-side-1.svg"
                alt="A taupe merino knit sweater"
                fill
                priority
                sizes="(min-width: 1024px) 24vw, 40vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div variants={reveal} className="relative overflow-hidden bg-beige">
              <Image
                src="/images/hero/hero-side-2.svg"
                alt="A bone poplin shirt"
                fill
                sizes="(min-width: 1024px) 24vw, 40vw"
                className="object-cover"
              />
            </motion.div>
          </div>
          <motion.div
            variants={reveal}
            className="absolute bottom-3 left-3 aspect-[4/5] w-[27%] overflow-hidden border-4 border-ivory bg-beige sm:-bottom-6 sm:-left-6"
          >
            <Image
              src="/images/hero/hero-inset.svg"
              alt="Close-up of a sage shirt collar and buttons"
              fill
              sizes="(min-width: 1024px) 16vw, 27vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
