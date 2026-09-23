import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface TaskCardProps {
  title: string;
  description: string;
  to: string;
}

export function TaskCard({ title, description, to }: TaskCardProps) {
  return (
    <Link
      to={to as NonNullable<LinkProps["to"]>}
      className="surface-card tap-target group flex flex-col justify-between gap-4 p-5 transition-shadow hover:shadow-lift"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Open
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
