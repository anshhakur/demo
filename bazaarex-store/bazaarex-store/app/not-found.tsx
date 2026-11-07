import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-28 md:py-40">
      <h1 className="font-serif text-6xl leading-none md:text-8xl">Page not found.</h1>
      <p className="mt-6 max-w-md text-lg text-grey">
        The page you&rsquo;re looking for has moved or doesn&rsquo;t exist. Try the shop instead.
      </p>
      <div className="mt-9 flex flex-wrap gap-4">
        <ButtonLink href="/shop">Go to the shop</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
