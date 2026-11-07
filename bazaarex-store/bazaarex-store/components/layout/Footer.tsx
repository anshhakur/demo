import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { categories } from "@/data/categories";
import { siteConfig } from "@/data/site";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";

const linkClass = "text-ivory/70 transition-colors hover:text-ivory";

export function Footer() {
  const { contact, socials } = siteConfig;

  return (
    <footer className="bg-charcoal text-ivory" data-theme="dark">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <p className="font-serif text-3xl tracking-[0.3em]">{siteConfig.name}</p>
            <p className="mt-5 max-w-xs text-ivory/70">
              Considered clothing in honest fabrics. Browse online, order on WhatsApp.
            </p>
            <ul className="mt-7 flex items-center gap-5">
              <li>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={linkClass}
                >
                  <InstagramIcon className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={linkClass}
                >
                  <FacebookIcon className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(generalEnquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className={linkClass}
                >
                  <WhatsAppIcon className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Shop categories">
            <h2 className="font-serif text-2xl">Shop</h2>
            <ul className="mt-5 space-y-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/shop?category=${category.slug}`} className={linkClass}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="font-serif text-2xl">Explore</h2>
            <ul className="mt-5 space-y-3">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-serif text-2xl">Visit or contact us</h2>
            <ul className="mt-5 space-y-4 text-ivory/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-ivory">
                  {contact.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <a href={`mailto:${contact.email}`} className="break-all hover:text-ivory">
                  {contact.email}
                </a>
              </li>
              <li className="pl-8">{contact.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-ivory/15 pt-6 text-sm text-ivory/60 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Orders are confirmed over WhatsApp. No online payments.</p>
        </div>
      </Container>
    </footer>
  );
}
