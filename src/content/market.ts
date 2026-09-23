/**
 * Market / locale configuration.
 *
 * Two markets are published: United States / English (existing routes at the
 * site root) and Japan / Japanese (routes under /jp).
 *
 * Market data is intentionally kept separate. Functions, labels, thresholds,
 * included content, contact channels and policies must NOT be copied between
 * markets. Anything not yet approved for Japan must be shown with the Japanese
 * internal draft notice instead of invented content.
 */

export type MarketId = "us" | "jp";

export interface Market {
  id: MarketId;
  country: string;
  language: string;
  label: string;
  shortLabel: string;
  /** BCP-47 language tag used for lang / hreflang. */
  lang: string;
  /** Route prefix. "" for the U.S. site root, "/jp" for Japan. */
  basePath: string;
  available: boolean;
}

export const MARKETS: Market[] = [
  {
    id: "us",
    country: "United States",
    language: "English",
    label: "United States / English",
    shortLabel: "US / EN",
    lang: "en-US",
    basePath: "",
    available: true,
  },
  {
    id: "jp",
    country: "日本",
    language: "日本語",
    label: "日本 / 日本語",
    shortLabel: "JP / 日本語",
    lang: "ja-JP",
    basePath: "/jp",
    available: true,
  },
];

export const US_MARKET = MARKETS[0]!;
export const JP_MARKET = MARKETS[1]!;

/** Legacy alias used by the U.S. pages. */
export const ACTIVE_MARKET = US_MARKET;

export const INTERNAL_PLACEHOLDER = "Internal configuration required before launch";

/** Japanese equivalent. Shown wherever approved Japan information is missing. */
export const JP_INTERNAL_PLACEHOLDER = "公開前に日本向け情報の確認が必要です";

export function marketForPath(pathname: string): Market {
  return pathname === "/jp" || pathname.startsWith("/jp/") ? JP_MARKET : US_MARKET;
}
