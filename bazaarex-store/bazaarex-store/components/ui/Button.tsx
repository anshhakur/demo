import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "light" | "ghost";

export function buttonStyles(variant: ButtonVariant = "primary", className?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-charcoal text-ivory hover:bg-charcoal/85",
    variant === "outline" &&
      "border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory",
    variant === "light" && "bg-ivory text-charcoal hover:bg-white",
    variant === "ghost" && "px-0 underline decoration-1 underline-offset-8 hover:decoration-2",
    className,
  );
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

/** Renders a Next.js Link for internal URLs and a plain anchor for external ones. */
export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  const styles = buttonStyles(variant, className);
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={styles} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}
