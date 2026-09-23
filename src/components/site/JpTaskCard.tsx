import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface JpTaskCardProps {
  title: string;
  description: string;
  to: string;
}

export function JpTaskCard({ title, description, to }: JpTaskCardProps) {
  return (
    <Link
      to={to as NonNullable<LinkProps["to"]>}
      className="surface-card tap-target group flex flex-col justify-between gap-4 p-5 transition-shadow hover:shadow-lift"
    >
      <div className="min-w-0">
        <h3 className="break-words text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 break-words text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        開く
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
