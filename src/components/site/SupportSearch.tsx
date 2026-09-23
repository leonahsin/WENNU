import { Link, useRouterState } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { useMemo } from "react";
import { SearchField } from "@/components/site/SearchField";
import { groupResults, searchSupport } from "@/lib/supportSearch";
import type { MarketId } from "@/content/market";

interface SupportSearchProps {
  market: MarketId;
  value: string;
  onChange: (value: string) => void;
  /** Optional id so several instances can coexist. */
  id?: string;
}

const COPY = {
  us: {
    label: "Search support",
    placeholder: "Try “temperature wrong”, “battery”, “cleaning”",
    none: "We couldn't find a match for that yet.",
    contact: "Contact Support",
    contactTo: "/contact",
    count: (n: number) => `${n} ${n === 1 ? "result" : "results"}`,
  },
  jp: {
    label: "サポートを検索",
    placeholder: "「数値がおかしい」「電池」「お手入れ」など",
    none: "該当するご案内が見つかりませんでした。",
    contact: "お問い合わせ",
    contactTo: "/jp/contact",
    count: (n: number) => `${n} 件の結果`,
  },
} as const;

/**
 * Unified, non-chat support search. Results are grouped by type in the approved
 * priority order and link straight to anchored content.
 */
export function SupportSearch({
  market,
  value,
  onChange,
  id = "support-search",
}: SupportSearchProps) {
  const copy = COPY[market];
  const results = useMemo(() => searchSupport(market, value), [market, value]);
  const groups = useMemo(() => groupResults(results), [results]);
  const query = value.trim();
  const routeHref = useRouterState({ select: (state) => state.location.href });
  const currentUrl = new URL(routeHref, "https://support.local");
  const returnParams = new URLSearchParams();
  if (currentUrl.searchParams.get("source") === "qr") returnParams.set("source", "qr");
  if (query) returnParams.set("q", query);
  const returnTo = `${currentUrl.pathname}${returnParams.size ? `?${returnParams.toString()}` : ""}`;

  const resultHref = (destination: string) => {
    if (!query) return destination;
    const hashIndex = destination.indexOf("#");
    const path = hashIndex >= 0 ? destination.slice(0, hashIndex) : destination;
    const hash = hashIndex >= 0 ? destination.slice(hashIndex) : "";
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}returnTo=${encodeURIComponent(returnTo)}${hash}`;
  };

  return (
    <div className="w-full" lang={market === "jp" ? "ja" : undefined}>
      <SearchField
        id={id}
        label={copy.label}
        placeholder={copy.placeholder}
        value={value}
        onChange={onChange}
        {...(query ? { hint: copy.count(results.length) } : {})}
      />

      {query ? (
        results.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {copy.none}{" "}
            <Link
              to={copy.contactTo as NonNullable<LinkProps["to"]>}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {copy.contact}
            </Link>
            .
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {groups.map((group) => (
              <ul key={group.type} className="space-y-3">
                {group.items.map((result) => (
                  <li key={result.id}>
                    <a
                      href={resultHref(result.to)}
                      className="surface-card block p-4 transition hover:-translate-y-0.5 hover:border-primary focus-visible:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                        {result.typeLabel}
                        {result.category ? ` · ${result.category}` : ""}
                      </p>
                      <h3 className="mt-1 break-words text-base font-semibold text-foreground underline-offset-4">
                        {result.title}
                      </h3>
                      <p className="mt-1 line-clamp-3 break-words text-sm text-muted-foreground">
                        {result.snippet}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            ))}
            <p className="text-sm text-muted-foreground">
              <Link
                to={copy.contactTo as NonNullable<LinkProps["to"]>}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {copy.contact}
              </Link>
            </p>
          </div>
        )
      ) : null}
    </div>
  );
}
