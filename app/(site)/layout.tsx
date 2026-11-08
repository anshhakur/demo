import { Providers } from "@/components/Providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { getCatalog } from "@/lib/catalog";

/** Store pages refresh from the database at most once a minute (or instantly after an admin change). */
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const products = await getCatalog();

  return (
    <Providers products={products}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </Providers>
  );
}
