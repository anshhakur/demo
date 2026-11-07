import { Bestsellers } from "@/components/home/Bestsellers";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { WhatsAppCta } from "@/components/home/WhatsAppCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <NewArrivals />
      <FeaturedCollection />
      <Bestsellers />
      <BrandStory />
      <WhatsAppCta />
    </>
  );
}
