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
}

export const PCI01_PRIMARY_US: PrimaryDestination[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Quick setup & your first reading.",
    to: "/getting-started",
    emphasis: "primary",
  },
  {
    id: "videos",
    title: "Video Guides",
    description: "Step-by-step video tutorials.",
    to: "/videos",
    emphasis: "secondary",
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Answers to common questions.",
    to: "/faq",
    emphasis: "secondary",
  },
  {
    id: "support-request",
    title: "Support Request",
    description: "Contact our support team.",
    to: "/support-request",
    emphasis: "secondary",
  },
];

export const PCI01_PRIMARY_JP: PrimaryDestination[] = [
  {
    id: "getting-started",
    title: "はじめてお使いになる方へ",
    description: "PCI01 の初期設定から最初の測定まで、順番にご案内します。",
    to: "/jp/getting-started",
    emphasis: "primary",
  },
  {
    id: "videos",
    title: "動画ガイド",
    description: "PCI01 の使い方とお手入れ方法を、動画でわかりやすくご案内します。",
    to: "/jp/videos",
    emphasis: "secondary",
  },
  {
    id: "faq",
    title: "よくあるご質問",
    description: "よくあるご質問とトラブル解決をひとつにまとめました。",
    to: "/jp/faq",
    emphasis: "secondary",
  },
  {
    id: "support-request",
    title: "サポート依頼",
    description: "解決しない場合は、状況をサポートチームへお送りください。",
    to: "/jp/support-request",
    emphasis: "secondary",
  },
];

export function primaryDestinations(market: MarketId): PrimaryDestination[] {
  return market === "jp" ? PCI01_PRIMARY_JP : PCI01_PRIMARY_US;
}
