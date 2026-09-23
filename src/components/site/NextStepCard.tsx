import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface NextStepCardProps {
  /** Short label above the step, e.g. "Next best step". */
  eyebrow: string;
  title: string;
  to: string;
  cta: string;
  lang?: string;
}

/** One compact forward step on deep pages — never competing CTAs. */
export function NextStepCard({ eyebrow, title, to, cta, lang }: NextStepCardProps) {
  return (
    <aside
      lang={lang}
      className="mt-12 flex flex-col gap-4 rounded-2xl bg-secondary/60 p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        <p className="mt-1 break-words text-lg font-semibold text-foreground">{title}</p>
      </div>
      <Link
        to={to as NonNullable<LinkProps["to"]>}
        className="tap-target inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        {cta}
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </aside>
  );
}
