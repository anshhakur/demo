import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="border-b border-beige">
      <Container className="py-14 md:py-20">
        <h1 className="font-serif text-5xl leading-none md:text-7xl">{title}</h1>
        {description ? <p className="mt-5 max-w-xl text-grey md:text-lg">{description}</p> : null}
        {children}
      </Container>
    </header>
  );
}
