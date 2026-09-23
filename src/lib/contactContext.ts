/**
 * Non-personal context handoff into the existing support-request flow.
 *
 * The support session carries only product, entry source, locale, issue
 * category, the label of the content the visitor was reading, and their search
 * query. Nothing personal is stored or transferred, and no backend field or
 * security rule changes: the context only preselects an existing form option.
 */

import type { MarketId } from "@/content/market";
import { readSupportState, type SupportSessionState } from "@/lib/supportSession";

/** Map an approved FAQ category / section label onto an existing issue topic. */
const TOPIC_BY_CATEGORY: Record<MarketId, Record<string, string>> = {
  us: {
    "Getting Started": "Setup and first use",
    "How to Use": "Setup and first use",
    "Measurement & Scanning": "Measurement consistency",
    "My Reading Looks Wrong": "Measurement consistency",
    "Understanding Temperature": "Measurement consistency",
    "Pet Temperature": "Measurement consistency",
    "Dogs & Cats": "Measurement consistency",
    "Product & Care": "Silicone cover and cleaning",
    Troubleshooting: "Power and battery issues",
    "Watch & Learn": "Setup and first use",
  },
  jp: {
    はじめに: "初期設定・はじめての使用",
    使い方: "初期設定・はじめての使用",
    測定とスキャン: "測定値のばらつき",
    数値がおかしいと感じたら: "測定値のばらつき",
    体温について: "測定値のばらつき",
    ペットの体温: "測定値のばらつき",
    犬と猫: "測定値のばらつき",
    製品とお手入れ: "シリコンカバー・お手入れ",
    困ったとき: "電源・電池",
  },
};

export interface ContactContext {
  topic: string | null;
  label: string | null;
  entrySource: SupportSessionState["entrySource"];
  searchQuery: string;
}

/** Read the carried context and resolve it against the market's issue topics. */
export function readContactContext(market: MarketId, topics: readonly string[]): ContactContext {
  const state = readSupportState();
  const mapped = state.issueCategory
    ? TOPIC_BY_CATEGORY[market][state.issueCategory]
    : undefined;
  return {
    topic: mapped && topics.includes(mapped) ? mapped : null,
    label: state.contextLabel,
    entrySource: state.entrySource,
    searchQuery: state.searchQuery,
  };
}
