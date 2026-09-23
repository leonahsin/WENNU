import { createFileRoute } from "@tanstack/react-router";
import { VideoGuidesPage } from "@/components/site/VideoGuidesPage";

export const Route = createFileRoute("/jp/videos")({
  head: () => ({
    meta: [
      { title: "PCI01 動画ガイド | WENNU サポート 日本" },
      {
        name: "description",
        content:
          "PCI01 の動画ガイド。はじめて使うとき、犬・猫の測定、測定値の見かた、お手入れ、困ったときの手順をご案内します。",
      },
      { property: "og:title", content: "PCI01 動画ガイド" },
      {
        property: "og:description",
        content: "初期設定・使い方・お手入れの短い動画ガイドです。",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/jp/videos" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/videos" },
      { rel: "alternate", hrefLang: "en-US", href: "/videos" },
      { rel: "alternate", hrefLang: "x-default", href: "/videos" },
    ],
  }),
  component: () => <VideoGuidesPage market="jp" />,
});
