/**
 * PCI01 Support Home information architecture.
 *
 * Four primary destinations come first in a fixed order. No brand story,
 * promotion or purchase CTA appears before them.
 */

import type { MarketId } from "./market";

export interface PrimaryDestination {
  id: "getting-started" | "videos" | "faq" | "support-request";
  title: string;
  description: string;
  to: string;
  emphasis: "primary" | "secondary";
  image: string; // 💡 新增圖片屬性
}

export const PCI01_PRIMARY_US: PrimaryDestination[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Quick setup & your first reading.",
    to: "/getting-started",
    emphasis: "primary",
    image: "/images/gettingstarted.png",
  },
  {
    id: "videos",
    title: "Video Guides",
    description: "Step-by-step video tutorials.",
    to: "/videos",
    emphasis: "secondary",
    image: "/images/videoguides.png",
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Answers to common questions.",
    to: "/faq",
    emphasis: "secondary",
    image: "/images/faq.png",
  },
  {
    id: "support-request",
    title: "Support Request",
    description: "Contact our support team.",
    to: "/support-request",
    emphasis: "secondary",
    image: "/images/supportrequest.png",
  },
];

export const PCI01_PRIMARY_JP: PrimaryDestination[] = [
  {
    id: "getting-started",
    title: "はじめてお使いになる方へ",
    description: "簡単なセットアップと、最初の測定。",
    to: "/jp/getting-started",
    emphasis: "primary",
    image: "/images/gettingstarted.png",
  },
  {
    id: "videos",
    title: "動画ガイド",
    description: "ステップごとの動画チュートリアル。",
    to: "/jp/videos",
    emphasis: "secondary",
    image: "/images/videoguides.png",
  },
  {
    id: "faq",
    title: "よくあるご質問",
    description: "よくある質問への回答。",
    to: "/jp/faq",
    emphasis: "secondary",
    image: "/images/faq.png",
  },
  {
    id: "support-request",
    title: "サポート依頼",
    description: "サポートチームへのお問い合わせ。",
    to: "/jp/support-request",
    emphasis: "secondary",
    image: "/images/supportrequest.png",
  },
];

export function primaryDestinations(market: MarketId): PrimaryDestination[] {
  return market === "jp" ? PCI01_PRIMARY_JP : PCI01_PRIMARY_US;
}