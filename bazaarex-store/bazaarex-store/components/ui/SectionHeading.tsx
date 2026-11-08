import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export function SectionHeading({
  id,
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-4", className)}>
      <div className="max-w-xl">
        <h2 id={id} className="font-serif text-4xl leading-none md:text-5xl">{title}</h2>
        {description ? <p className="mt-4 text-grey">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="text-sm font-medium underline decoration-1 underline-offset-8 hover:decoration-2"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
