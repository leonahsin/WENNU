/**
 * Simplified public homepage information architecture.
 *
 * Progressive disclosure: the homepage exposes three primary choices (with the
 * video guides card as the strongest one) plus a compact popular-help row of
 * three links. Everything else stays reachable from deeper pages and the footer.
 */

export interface PrimaryCard {
  id: "videos" | "fix" | "contact";
  title: string;
  description: string;
  to: string;
  /** "primary" renders the dominant filled card; "secondary" stays quieter. */
  emphasis: "primary" | "secondary";
}

export interface QuickLink {
  label: string;
  to: string;
}

export const US_PRIMARY_CARDS: PrimaryCard[] = [
  {
    id: "videos",
    title: "Watch Video Guides",
    description: "Learn setup, use, and cleaning step by step.",
    to: "/videos",
    emphasis: "primary",
  },
  {
    id: "fix",
    title: "Fix a Problem",
    description: "Quick help when something isn't working.",
    to: "/troubleshooting",
    emphasis: "secondary",
  },
  {
    id: "contact",
    title: "Contact Support",
    description: "Send us the details if you still need help.",
    to: "/contact",
    emphasis: "secondary",
  },
];

export const US_POPULAR_HELP: QuickLink[] = [
  { label: "Getting Started", to: "/getting-started" },
  { label: "FAQ", to: "/faq" },
];

export const JP_PRIMARY_CARDS: PrimaryCard[] = [
  {
    id: "videos",
    title: "動画ガイドを見る",
    description: "初期設定、使い方、お手入れを順番にご確認いただけます。",
    to: "/jp/videos",
    emphasis: "primary",
  },
  {
    id: "fix",
    title: "トラブルを解決する",
    description: "うまく動かないときの確認手順をご案内します。",
    to: "/jp/troubleshooting",
    emphasis: "secondary",
  },
  {
    id: "contact",
    title: "サポートに問い合わせる",
    description: "解決しない場合は、詳しい状況をお知らせください。",
    to: "/jp/contact",
    emphasis: "secondary",
  },
];

export const JP_POPULAR_HELP: QuickLink[] = [
  { label: "はじめてお使いになる方へ", to: "/jp/getting-started" },
  { label: "よくあるご質問", to: "/jp/faq" },
];
