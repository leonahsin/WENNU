/**
 * Video guide catalog.
 *
 * Scalable, typed and market-scoped. Entries below are approved structured
 * placeholders: no video URL, captions, transcript, duration or presenter is
 * invented. A card is only playable once `published` is true AND a videoUrl
 * has been added by an approved market owner.
 */

import type { MarketId } from "./market";
import type { HowToSectionId } from "./howToUse";

export type VideoCategoryId = "getting-started" | "how-to-use" | "cleaning-care";

export interface VideoCategory {
  id: VideoCategoryId;
  label: string;
}

export interface VideoGuide {
  id: string;
  /** Locale-independent key, e.g. "dogs". Used for anchors and cross-links. */
  baseId: string;
  market: MarketId;
  /** BCP-47 locale of the guide copy. */
  locale: string;
  category: VideoCategoryId;
  title: string;
  description: string;
  /** Stable deep-link anchor, e.g. "video-dogs". */
  anchor: string;
  /** Approved poster/thumbnail image URL. Null until artwork is confirmed. */
  thumbnailUrl: string | null;
  /** Embedded (YouTube/Vimeo) or self-hosted source. Null until approved. */
  videoUrl: string | null;
  /** WebVTT captions track. Null until approved. */
  captionsUrl: string | null;
  /** Plain-text transcript. Null until approved. */
  transcript: string | null;
  /** Human-readable duration, e.g. "2:14". Hidden in the UI until confirmed. */
  duration: string | null;
  published: boolean;
}

export const VIDEO_CATEGORIES_US: VideoCategory[] = [
  { id: "getting-started", label: "Getting Started" },
  { id: "how-to-use", label: "How to Use" },
  { id: "cleaning-care", label: "Cleaning & Care" },
];

export const VIDEO_CATEGORIES_JP: VideoCategory[] = [
  { id: "getting-started", label: "はじめて使う" },
  { id: "how-to-use", label: "使い方" },
  { id: "cleaning-care", label: "お手入れ" },
];

const US_ENTRIES: {
  id: string;
  category: VideoCategoryId;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  duration?: string;
  locale?: string;
}[] = [
  {
    id: "getting-started",
    title: "Getting Started with PCI01",
    description: "Meet the device, identify its buttons, and install two AAA batteries and power it on.",
    category: "getting-started",
    thumbnailUrl: "/video1.png",
    videoUrl: "https://www.youtube.com/embed/FK1stNDefus?si=4u0HQ2CVPsf1Jjib",
    duration: "2:30",
    locale: "en",
  },
  {
    id: "memory",
    category: "how-to-use",
    title: "Using the Memory Function",
    description:
      "Use the memory button to recall past readings, with storage for up to 30 readings.",
  },
  {
    id: "dogs",
    category: "how-to-use",
    title: "Measuring Your Dog",
    description:
      "Switch to Dog mode, then learn the correct hold and positioning for each measuring spot.",
  },
  {
    id: "cats",
    category: "how-to-use",
    title: "Measuring Your Cat",
    description: "Switch to Cat mode, then learn the comb function and gentle measuring positions.",
  },
  {
    id: "keep-scanning",
    category: "how-to-use",
    title: "Why Keep Scanning?",
    description: "Scan a few times and use the stable reading instead of relying on a single scan.",
  },
  {
    id: "clean-tip",
    category: "cleaning-care",
    title: "Cleaning PCI01",
    description:
      "Hand-washing the removable blue silicone cover and washing the silicone measuring end and comb teeth with water, while the device body stays dry.",
  },
  {
    id: "remove-cover-battery",
    category: "cleaning-care",
    title: "Removing the blue silicone cover before opening the back cover",
    description: "For a battery change, remove the silicone cover first, then open the back cover.",
  },
];

const JP_ENTRIES: {
  id: string;
  category: VideoCategoryId;
  title: string;
  description: string;
}[] = [
  {
    id: "overview",
    category: "getting-started",
    title: "PCI01 をはじめて使う",
    description:
      "本体の各部とボタンを確認し、単4形乾電池2本を入れて電源を入れるまでをご案内します。",
  },
  {
    id: "memory",
    category: "how-to-use",
    title: "メモリー機能の使い方",
    description: "メモリーボタンで過去の測定値を確認します。最大30件まで保存できます。",
  },
  {
    id: "dogs",
    category: "how-to-use",
    title: "犬の測定",
    description: "犬モードに切り替え、正しい持ち方と測定位置をご案内します。",
  },
  {
    id: "cats",
    category: "how-to-use",
    title: "猫の測定",
    description: "猫モードに切り替え、コーム機能とやさしい測定位置をご案内します。",
  },
  {
    id: "keep-scanning",
    category: "how-to-use",
    title: "続けて測る理由",
    description: "1回だけで判断せず、複数回測定して安定した数値を確認します。",
  },
  {
    id: "clean-tip",
    category: "cleaning-care",
    title: "PCI01 のお手入れ",
    description:
      "取り外せるブルーのシリコンカバーは手洗い、シリコン製の測定先端とコームの歯は水洗い。本体は濡らさずにお手入れします。",
  },
  {
    id: "remove-cover-battery",
    category: "cleaning-care",
    title: "背面カバーを開ける前にカバーを外す",
    description: "電池交換時は、先にシリコンカバーを外してから背面カバーを開けます。",
  },
];

/**
 * Display order shared by every locale.
 */
export const VIDEO_ORDER = [
  "overview",
  "memory",
  "dogs",
  "cats",
  "keep-scanning",
  "clean-tip",
  "remove-cover-battery",
] as const;

/** Related self-service content per guide: a How to Use anchor and an FAQ item. */
export const VIDEO_RELATED: Record<string, { howTo?: HowToSectionId; faqId?: string }> = {
  overview: { howTo: "choose-your-mode", faqId: "what-it-does" },
  memory: {},
  dogs: { howTo: "position-the-thermometer", faqId: "dogs-and-cats" },
  cats: { howTo: "position-the-thermometer", faqId: "dogs-and-cats" },
  "keep-scanning": { howTo: "keep-scanning", faqId: "consistency" },
  "clean-tip": { faqId: "batteries" },
  "remove-cover-battery": { faqId: "batteries" },
};

function sortByOrder<T extends { id: string }>(entries: T[]): T[] {
  const rank = (id: string) => {
    const i = (VIDEO_ORDER as readonly string[]).indexOf(id);
    return i === -1 ? VIDEO_ORDER.length : i;
  };
  return [...entries].sort((a, b) => rank(a.id) - rank(b.id));
}

function build(
  market: MarketId,
  locale: string,
  entries: any[],
): VideoGuide[] {
  return sortByOrder(entries).map((entry) => ({
    ...entry,
    id: `${market}-${entry.id}`,
    baseId: entry.id,
    anchor: `video-${entry.id}`,
    market,
    locale,
    captionsUrl: null,
    transcript: null,
    published: true,
  }));
}

export const VIDEO_GUIDES: VideoGuide[] = [
  ...build("us", "en-US", US_ENTRIES),
  ...build("jp", "ja-JP", JP_ENTRIES),
];

export function videosForMarket(market: MarketId): VideoGuide[] {
  return VIDEO_GUIDES.filter((video) => video.market === market);
}

/** Filter by market and category. `"all"` keeps every video for that market. */
export function filterVideos(market: MarketId, category: VideoCategoryId | "all"): VideoGuide[] {
  const list = videosForMarket(market);
  return category === "all" ? list : list.filter((video) => video.category === category);
}

/** The single featured guide for a market: the first in the shared order. */
export function featuredVideo(market: MarketId): VideoGuide | undefined {
  return videosForMarket(market)[0];
}

/** A video is only playable when it is published and has an approved source. */
export function isPlayable(video: VideoGuide): boolean {
  return video.published && Boolean(video.videoUrl);
}
