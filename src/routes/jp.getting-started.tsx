import { createFileRoute } from "@tanstack/react-router";
import { HowToUsePage } from "@/components/site/HowToUsePage";

export const Route = createFileRoute("/jp/getting-started")({
  head: () => ({
    meta: [
      { title: "PCI01 を使い始める | PCI01 サポート 日本" },
      { name: "description", content: "モード選択から測定までを順番にご案内します。" },
      { property: "og:title", content: "PCI01 を使い始める" },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "/jp/getting-started" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/getting-started" },
      { rel: "alternate", hrefLang: "en-US", href: "/getting-started" },
      { rel: "alternate", hrefLang: "x-default", href: "/getting-started" },
    ],
  }),
  component: () => <HowToUsePage market="jp" />,
});
