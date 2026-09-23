import { useEffect, useState } from "react";
import type { MarketId } from "@/content/market";
import { readSupportState, type SupportSessionState } from "@/lib/supportSession";

const COPY = {
  us: {
    eyebrow: "Carried from your last step",
    question: "Question",
    category: "Topic",
    search: "Search",
    note: "Only this non-personal context is carried. Nothing about you is stored or sent.",
  },
  jp: {
    eyebrow: "直前にご覧になっていた内容",
    question: "ご質問",
    category: "カテゴリー",
    search: "検索キーワード",
    note: "個人情報は引き継がれません。上記の内容のみを参考として引き継いでいます。",
  },
} as const;

/**
 * Shows the non-personal context carried from self-service content into the
 * contact flow. Rendered only when something was actually carried.
 */
export function CarriedContextNote({ market }: { market: MarketId }) {
  const copy = COPY[market];
  const [state, setState] = useState<SupportSessionState | null>(null);
  useEffect(() => setState(readSupportState()), []);

  if (!state) return null;
  const rows = [
    state.contextLabel ? { label: copy.question, value: state.contextLabel } : null,
    state.issueCategory ? { label: copy.category, value: state.issueCategory } : null,
    state.searchQuery ? { label: copy.search, value: state.searchQuery } : null,
  ].filter(Boolean) as { label: string; value: string }[];
  if (rows.length === 0) return null;

  return (
    <section
      aria-label={copy.eyebrow}
      data-testid="carried-context"
      lang={market === "jp" ? "ja" : undefined}
      className="surface-card p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{copy.eyebrow}</p>
      <dl className="mt-2 space-y-1 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap gap-2">
            <dt className="font-semibold text-foreground">{row.label}:</dt>
            <dd className="break-words text-muted-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">{copy.note}</p>
    </section>
  );
}
