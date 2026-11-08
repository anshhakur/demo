import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";

export function WhatsAppCta() {
  return (
    <section className="bg-beige" aria-labelledby="whatsapp-title">
      <Container className="flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-xl">
          <h2 id="whatsapp-title" className="font-serif text-4xl leading-tight md:text-6xl">
            Shop with us on WhatsApp.
          </h2>
          <p className="mt-5 text-lg text-charcoal/80">
            Send us a message about the piece you like. We&rsquo;ll confirm size, availability and
            delivery with you directly, and answer any questions about fit.
          </p>
        </div>
        <a
          href={buildWhatsAppUrl(generalEnquiryMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles("primary", "shrink-0 px-9 py-4 text-base")}
        >
          <WhatsAppIcon className="h-5 w-5" />
          Chat on WhatsApp
        </a>
      </Container>
    </section>
  );
}
