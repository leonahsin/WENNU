/**
 * Unified support search (no AI chat surface).
 *
 * Searches approved FAQ items, How to Use sections, troubleshooting entries and
 * video placeholders for one market. Ranking puts the most relevant approved
 * answer first, then FAQ, How to Use, troubleshooting and video results.
 *
 * Internal draft / compliance-review text is never indexed, so it can never
 * appear as a search result.
 */

import { buildSearchKeys, matchesSearch, tokenize } from "@/lib/search";
import { buildJaHaystack, matchesJaSearch, normalizeJa, splitJaQuery } from "@/lib/searchJa";
import type { MarketId } from "@/content/market";
import { FAQ_ITEMS, TROUBLESHOOTING_CATEGORIES } from "@/content/support";
import { JP_FAQ_ITEMS, JP_TROUBLESHOOTING_CATEGORIES } from "@/content/jp/support";
import { howToSections } from "@/content/howToUse";
import { videosForMarket } from "@/content/videos";

export type SupportResultType = "faq" | "how-to-use" | "troubleshooting" | "video";

export interface SupportSearchResult {
  id: string;
  type: SupportResultType;
  /** Localized, human-readable result-type label. */
  typeLabel: string;
  title: string;
  snippet: string;
  /** Full destination including any anchor. */
  to: string;
  category?: string;
}

const TYPE_RANK: Record<SupportResultType, number> = {
  faq: 0,
  "how-to-use": 1,
  troubleshooting: 2,
  video: 3,
};

const TYPE_LABELS: Record<MarketId, Record<SupportResultType, string>> = {
  us: {
    faq: "Answer",
    "how-to-use": "Getting Started",
    troubleshooting: "FAQ & Troubleshooting",
    video: "Video",
  },
  jp: {
    faq: "回答",
    "how-to-use": "使い方",
    troubleshooting: "困ったとき",
    video: "動画",
  },
};

/** Common non-technical wording and misspellings mapped onto indexed terms. */
const US_PHRASE_ALIASES: Record<string, string[]> = {
  wrong: ["vary", "varies", "inconsistent", "different", "reading"],
  weird: ["vary", "inconsistent", "reading"],
  off: ["vary", "inconsistent", "reading"],
  temp: ["temperature"],
  temperture: ["temperature"],
  temprature: ["temperature"],
  tempature: ["temperature"],
  batery: ["battery"],
  batteries: ["battery"],
  scaning: ["scanning"],
  cleaning: ["clean"],
  washing: ["wash"],
  broken: ["turn", "power", "work"],
  dead: ["power", "turn"],
  puppy: ["dog"],
  kitten: ["cat"],
};

const JP_PHRASE_ALIASES: Record<string, string[]> = {
  おかしい: ["ばらつく", "違う", "数値"],
  へん: ["ばらつく", "数値"],
  変: ["ばらつく", "数値"],
  体温: ["温度", "傾向"],
  こわれた: ["電源", "動かない"],
  壊れた: ["電源", "動かない"],
  子犬: ["犬"],
  子猫: ["猫"],
};

interface IndexedEntry {
  result: SupportSearchResult;
  /** Latin token keys (U.S.). */
  keys: Set<string>;
  /** Normalized haystack (Japan). */
  haystack: string;
}

function buildIndex(market: MarketId): IndexedEntry[] {
  const jp = market === "jp";
  const base = jp ? "/jp" : "";
  const labels = TYPE_LABELS[market];
  const entries: IndexedEntry[] = [];

  const push = (result: SupportSearchResult, fields: (string | string[] | undefined)[]) => {
    entries.push({
      result,
      keys: buildSearchKeys(fields),
      haystack: buildJaHaystack(fields),
    });
  };

  const faqItems = jp ? JP_FAQ_ITEMS : FAQ_ITEMS;
  for (const item of faqItems) {
    push(
      {
        id: `faq-${item.id}`,
        type: "faq",
        typeLabel: labels.faq,
        title: item.question,
        snippet: item.answer,
        to:
          item.id === "consistency"
            ? `${base}/faq#troubleshooting-inconsistent-measurements`
            : `${base}/faq#faq-${item.id}`,
        category: item.category,
      },
      [item.question, item.answer, item.category, item.keywords],
    );
  }

  for (const section of howToSections(market)) {
    push(
      {
        id: `how-to-${section.id}`,
        type: "how-to-use",
        typeLabel: labels["how-to-use"],
        title: section.title,
        snippet: section.summary,
        to: `${base}/getting-started#${section.id}`,
      },
      [section.title, section.summary, section.body, section.keywords],
    );
  }

  const troubleshooting = jp ? JP_TROUBLESHOOTING_CATEGORIES : TROUBLESHOOTING_CATEGORIES;
  for (const item of troubleshooting) {
    push(
      {
        id: `trouble-${item.id}`,
        type: "troubleshooting",
        typeLabel: labels.troubleshooting,
        title: item.title,
        snippet: item.description,
        to: `${base}/faq#troubleshooting-${item.id}`,
      },
      [item.title, item.description, item.symptoms],
    );
  }

  for (const video of videosForMarket(market)) {
    push(
      {
        id: `video-${video.baseId}`,
        type: "video",
        typeLabel: labels.video,
        title: video.title,
        snippet: video.description,
        to: `${base}/videos#${video.anchor}`,
      },
      [video.title, video.description],
    );
  }

  return entries;
}

const INDEX: Record<MarketId, IndexedEntry[]> = {
  us: buildIndex("us"),
  jp: buildIndex("jp"),
};

function normalizePresetQuery(query: string): string {
  return query
    .trim()
    .toLocaleLowerCase()
    .replace(/[?!？。]/g, "")
    .replace(/\s+/g, " ");
}

const PRESET_RESULTS: Record<
  MarketId,
  Array<{ aliases: string[]; result: SupportSearchResult }>
> = {
  us: [
    {
      aliases: ["how do i measure", "how do i use pci01"],
      result: {
        id: "preset-measure",
        type: "faq",
        typeLabel: "Answer",
        category: "Getting Started",
        title: "How do I measure with PCI01?",
        snippet:
          "Turn PCI01 on, choose dog or cat mode, and follow the step-by-step guide to complete a consistent reading.",
        to: "/getting-started",
      },
    },
    {
      aliases: ["how do i clean it", "how do i clean pci01"],
      result: {
        id: "preset-clean",
        type: "faq",
        typeLabel: "Answer",
        category: "Cleaning & Care",
        title: "How do I clean PCI01?",
        snippet:
          "Gently wipe the measuring surface with a soft cloth, and keep water or cleaning liquid out of the device.",
        to: "/faq#cleaning-care",
      },
    },
    {
      aliases: ["what does orange mean", "what does the orange light mean"],
      result: {
        id: "preset-orange",
        type: "faq",
        typeLabel: "Answer",
        category: "Understanding Temperature",
        title: "What does orange mean?",
        snippet:
          "Orange means a higher reading was detected. It is a care prompt, not a diagnosis.",
        to: "/faq#faq-orange-backlight",
      },
    },
    {
      aliases: ["what batteries does pci01 use", "what batteries does the pci01 use"],
      result: {
        id: "preset-batteries",
        type: "faq",
        typeLabel: "Answer",
        category: "Product & Care",
        title: "What batteries does the PCI01 use?",
        snippet:
          "PCI01 uses two AAA batteries. Follow the + and − markings inside the compartment when you put them in.",
        to: "/faq#faq-batteries",
      },
    },
    {
      aliases: ["can dogs and cats both use it", "can dogs and cats use pci01"],
      result: {
        id: "preset-dogs-and-cats",
        type: "faq",
        typeLabel: "Answer",
        category: "Dogs & Cats",
        title: "Can dogs and cats both use it?",
        snippet:
          "Yes. Select the dog or cat setting before each use, and keep a separate trend history for each pet.",
        to: "/faq#faq-dogs-and-cats",
      },
    },
    {
      aliases: ["does it need an app or wi-fi", "does pci01 need an app or wifi"],
      result: {
        id: "preset-app-wifi",
        type: "faq",
        typeLabel: "Answer",
        category: "Getting Started",
        title: "Does it need an app or Wi-Fi?",
        snippet: "No. Everyday temperature-trend observation works without an app or Wi-Fi.",
        to: "/faq#faq-app-wifi",
      },
    },
    {
      aliases: [
        "what should i do after a high-temperature alert",
        "what should i do after an alert",
      ],
      result: {
        id: "preset-after-alert",
        type: "faq",
        typeLabel: "Answer",
        category: "Understanding Temperature",
        title: "What should I do after a high-temperature alert?",
        snippet:
          "Keep observing your pet and consult a veterinarian if you are concerned. The alert is a care prompt, not a diagnosis.",
        to: "/faq#faq-after-alert",
      },
    },
    {
      aliases: ["talk to a human", "talk to a person"],
      result: {
        id: "preset-human",
        type: "faq",
        typeLabel: "Answer",
        category: "Support Request",
        title: "Talk to a human",
        snippet:
          "Of course — our support team can help with warranty, returns and anything else. Email service@techncare.jp and we'll get back to you within 1 business day.",
        to: "/support-request",
      },
    },
  ],
  jp: [
    {
      aliases: ["測定方法は", "pci01の使い方は"],
      result: {
        id: "preset-measure-jp",
        type: "faq",
        typeLabel: "回答",
        category: "はじめに",
        title: "PCI01の測定方法は？",
        snippet:
          "PCI01の電源を入れ、犬用または猫用の設定を選んでから、手順に沿って測定してください。",
        to: "/jp/getting-started",
      },
    },
    {
      aliases: ["お手入れ方法は", "pci01のお手入れ方法は"],
      result: {
        id: "preset-clean-jp",
        type: "faq",
        typeLabel: "回答",
        category: "お手入れ",
        title: "PCI01のお手入れ方法は？",
        snippet: "測定面を柔らかい布でやさしく拭き、本体に水や洗浄液が入らないようにしてください。",
        to: "/jp/faq#cleaning-care",
      },
    },
    {
      aliases: ["オレンジ表示の意味は", "オレンジの意味は"],
      result: {
        id: "preset-orange-jp",
        type: "faq",
        typeLabel: "回答",
        category: "体温について",
        title: "オレンジ表示の意味は？",
        snippet:
          "オレンジ表示は高めの数値が検出されたことを示します。色はケアのための目安であり、診断ではありません。",
        to: "/jp/faq#faq-orange-backlight",
      },
    },
    {
      aliases: ["電池は何を使いますか", "pci01の電池は何ですか"],
      result: {
        id: "preset-batteries-jp",
        type: "faq",
        typeLabel: "回答",
        category: "製品とお手入れ",
        title: "電池は何を使いますか？",
        snippet: "PCI01は単4形電池を2本使用します。電池室の＋と−の表示に合わせて入れてください。",
        to: "/jp/faq#faq-batteries",
      },
    },
    {
      aliases: ["犬にも猫にも使えますか", "犬と猫の両方に使えますか"],
      result: {
        id: "preset-dogs-and-cats-jp",
        type: "faq",
        typeLabel: "回答",
        category: "犬と猫",
        title: "犬にも猫にも使えますか？",
        snippet: "はい。使用前に犬用または猫用の設定を選び、ペットごとに記録を分けてください。",
        to: "/jp/faq#faq-dogs-and-cats",
      },
    },
    {
      aliases: ["アプリやwi-fiは必要ですか", "アプリやwifiは必要ですか"],
      result: {
        id: "preset-app-wifi-jp",
        type: "faq",
        typeLabel: "回答",
        category: "はじめに",
        title: "アプリや Wi-Fi は必要ですか？",
        snippet: "いいえ。日常の体温傾向の観察は、アプリやWi-Fiなしで使用できます。",
        to: "/jp/faq#faq-app-wifi",
      },
    },
    {
      aliases: ["高温アラートが出たら", "高温アラートが出たときはどうすればよいですか"],
      result: {
        id: "preset-after-alert-jp",
        type: "faq",
        typeLabel: "回答",
        category: "体温について",
        title: "高温アラートが出たときはどうすればよいですか？",
        snippet:
          "引き続きペットの様子を観察し、心配な場合は獣医師に相談してください。アラートは診断ではありません。",
        to: "/jp/faq#faq-after-alert",
      },
    },
    {
      aliases: ["担当者に相談したい", "人に相談したい"],
      result: {
        id: "preset-human-jp",
        type: "faq",
        typeLabel: "回答",
        category: "サポート依頼",
        title: "担当者に相談したい",
        snippet:
          "保証、返品、その他のお困りごとは service@techncare.jp へメールでお問い合わせください。1営業日以内にご返信します。",
        to: "/jp/support-request",
      },
    },
  ],
};

function presetResultFor(market: MarketId, query: string): SupportSearchResult | undefined {
  const normalized = normalizePresetQuery(query);
  return PRESET_RESULTS[market].find(({ aliases }) => aliases.includes(normalized))?.result;
}

function expandUsQuery(query: string): string[] {
  const tokens = tokenize(query);
  const expanded = new Set(tokens);
  for (const token of tokens)
    for (const alias of US_PHRASE_ALIASES[token] ?? []) expanded.add(alias);
  return [...expanded];
}

function expandJpQuery(query: string): string[] {
  const chunks = splitJaQuery(query);
  const expanded = new Set(chunks.map(normalizeJa));
  for (const chunk of chunks) {
    for (const alias of JP_PHRASE_ALIASES[chunk] ?? []) expanded.add(normalizeJa(alias));
  }
  return [...expanded];
}

function scoreUs(entry: IndexedEntry, tokens: string[]): number {
  let score = 0;
  const title = entry.result.title.toLowerCase();
  for (const token of tokens) {
    if (entry.keys.has(token)) score += 3;
    else if ([...entry.keys].some((k) => k.length >= 3 && k.startsWith(token))) score += 1;
    if (title.includes(token)) score += 2;
  }
  return score;
}

function scoreJp(entry: IndexedEntry, chunks: string[]): number {
  let score = 0;
  const title = normalizeJa(entry.result.title);
  for (const chunk of chunks) {
    if (entry.haystack.includes(chunk)) score += 3;
    if (title.includes(chunk)) score += 2;
  }
  return score;
}

/**
 * Ranked results for a query. Empty query returns no results (the caller shows
 * its normal browse UI instead).
 */
export function searchSupport(market: MarketId, query: string): SupportSearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const preset = presetResultFor(market, trimmed);
  if (preset) return [preset];
  const jp = market === "jp";
  const entries = INDEX[market];

  const expanded = jp ? expandJpQuery(trimmed) : expandUsQuery(trimmed);
  if (expanded.length === 0) return [];

  const scored = entries
    .map((entry) => {
      const direct = jp
        ? matchesJaSearch(trimmed, entry.haystack)
        : matchesSearch(trimmed, entry.keys);
      const score = jp ? scoreJp(entry, expanded) : scoreUs(entry, expanded);
      return { entry, score: score + (direct ? 4 : 0) };
    })
    .filter(({ score }) => score > 0);

  // Result-type priority is fixed by the approved architecture: the most
  // relevant approved answer (FAQ) first, then How to Use, troubleshooting and
  // finally video. Relevance orders results inside each type.
  scored.sort((a, b) => {
    const rank = TYPE_RANK[a.entry.result.type] - TYPE_RANK[b.entry.result.type];
    if (rank !== 0) return rank;
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.result.title.localeCompare(b.entry.result.title);
  });

  return scored.map(({ entry }) => entry.result);
}

/** Grouped view used by the results UI: FAQ first, then How to Use, etc. */
export function groupResults(results: SupportSearchResult[]) {
  const order: SupportResultType[] = ["faq", "how-to-use", "troubleshooting", "video"];
  return order
    .map((type) => ({ type, items: results.filter((r) => r.type === type) }))
    .filter((group) => group.items.length > 0);
}
