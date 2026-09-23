import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryCardLinkProps {
  title: string;
  description: string;
  to: string;
  lang?: string;
  /** "primary" is the single dominant action on the page. */
  emphasis?: "primary" | "secondary";
}

/** Large, low-noise homepage choice. One per key task. */
export function PrimaryCardLink({
  title,
  description,
  to,
  lang,
  emphasis = "secondary",
}: PrimaryCardLinkProps) {
  const isPrimary = emphasis === "primary";

  return (
    <Link
      to={to as NonNullable<LinkProps["to"]>}
      lang={lang}
      className={cn(
        "tap-target group flex min-h-[9.5rem] flex-col justify-between gap-5 rounded-2xl p-6 transition-shadow sm:p-7",
        isPrimary
          ? "bg-primary text-primary-foreground shadow-sm hover:shadow-lift"
          : "bg-card text-foreground shadow-sm ring-1 ring-border/60 hover:shadow-lift",
      )}
    >
      <div className="min-w-0">
        <h3
          className={cn(
            "break-words text-xl font-semibold sm:text-2xl",
            isPrimary ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-2 break-words text-base",
            isPrimary ? "text-primary-foreground/85" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      </div>
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center",
          isPrimary ? "text-primary-foreground" : "text-primary",
        )}
      >
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
      </span>
    </Link>
  );
}
