import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { VideoCard } from "@/components/site/VideoCard";
import { NextStepCard } from "@/components/site/NextStepCard";
import {
  VIDEO_CATEGORIES_JP,
  VIDEO_CATEGORIES_US,
  filterVideos,
  type VideoCategoryId,
} from "@/content/videos";
import type { MarketId } from "@/content/market";
import { useScrollRestore } from "@/lib/useSupportSession";

const COPY = {
  us: {
    home: "PCI01 Support",
    homeTo: "/product/pci01",
    crumb: "Watch & Learn",
    title: "PCI01 video guides",
    description: "Short videos that walk through setup, measuring, care and common fixes.",
    all: "All guides",
    allChip: "All",
    filter: "Filter videos by category",
    count: (n: number) => `Showing ${n} video guides.`,
    duration: "Duration confirmed when the video is published",
    comingSoon: "Video coming soon",
    nextEyebrow: "Next best step",
    nextTitle: "Something still not working?",
    nextTo: "/faq#troubleshooting",
    nextCta: "Fix a problem",
    stuck: "Still stuck?",
    contact: "Contact Support",
    contactTo: "/contact",
  },
  jp: {
    home: "PCI01 サポート",
    homeTo: "/jp/product/pci01",
    crumb: "動画で見る",
    title: "PCI01 動画ガイド",
    description: "初期設定・測定・お手入れ・困ったときの手順を短い動画でご案内します。",
    all: "すべてのガイド",
    allChip: "すべて",
    filter: "カテゴリーで絞り込む",
    count: (n: number) => `${n} 件の動画ガイドを表示しています。`,
    duration: "再生時間は公開時にご案内します",
    comingSoon: "動画は準備中です",
    nextEyebrow: "次のステップ",
    nextTitle: "まだ解決しませんか？",
    nextTo: "/jp/faq#troubleshooting",
    nextCta: "トラブルを解決する",
    stuck: "解決しない場合",
    contact: "お問い合わせ",
    contactTo: "/jp/contact",
  },
} as const;

export function VideoGuidesPage({ market }: { market: MarketId }) {
  const jp = market === "jp";
  const copy = COPY[market];
  const categories = jp ? VIDEO_CATEGORIES_JP : VIDEO_CATEGORIES_US;
  const [category, setCategory] = useState<VideoCategoryId | "all">("all");
  const videos = useMemo(() => filterVideos(market, category), [market, category]);
  useScrollRestore(`${market}:videos`);

  const chips: { id: VideoCategoryId | "all"; label: string }[] = [
    { id: "all", label: copy.allChip },
    ...categories,
  ];

  const categoryLabel = (id: VideoCategoryId) => categories.find((c) => c.id === id)?.label ?? "";

  return (
    <>
      <PageHeader
        crumbs={[{ label: copy.home, to: copy.homeTo }, { label: copy.crumb }]}
        title={copy.title}
        description={copy.description}
      />

      <main lang={jp ? "ja" : undefined} className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="text-sm font-semibold text-muted-foreground">{copy.all}</h2>
        <div role="group" aria-label={copy.filter} className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => {
            const active = chip.id === category;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(chip.id)}
                className={`tap-target rounded-full px-4 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <p role="status" aria-live="polite" className="mt-4 text-sm text-muted-foreground">
          {copy.count(videos.length)}
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div key={video.id} id={video.anchor} className="scroll-mt-24">
              <VideoCard
                video={video}
                categoryLabel={categoryLabel(video.category)}
                comingSoonLabel={copy.comingSoon}
                durationPlaceholder={copy.duration}
                thumbnailAlt={`${video.title}`}
                {...(jp ? { lang: "ja" } : {})}
              />
            </div>
          ))}
        </div>

        <NextStepCard
          eyebrow={copy.nextEyebrow}
          title={copy.nextTitle}
          to={copy.nextTo}
          cta={copy.nextCta}
          {...(jp ? { lang: "ja" } : {})}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          {copy.stuck}{" "}
          <Link
            to={copy.contactTo as NonNullable<LinkProps["to"]>}
            className="font-semibold text-primary hover:underline"
          >
            {copy.contact}
          </Link>
          .
        </p>
      </main>
    </>
  );
}
