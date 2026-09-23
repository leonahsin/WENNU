import { createFileRoute } from "@tanstack/react-router";
import { ProductSelection } from "@/components/site/ProductSelection";

export const Route = createFileRoute("/jp/")({
  head: () => ({
    meta: [
      { title: "WENNU サポート | 製品をお選びください" },
      {
        name: "description",
        content:
          "WENNU 製品のサポートページです。PCI01 の使い方、測定値の見かた、動画ガイド、よくあるご質問をご案内します。",
      },
      { property: "og:title", content: "WENNU サポート | 製品をお選びください" },
      {
        property: "og:description",
        content: "WENNU のペットケア製品のサポート。まずは PCI01 からご案内します。",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/jp" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp" },
      { rel: "alternate", hrefLang: "en-US", href: "/" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: () => <ProductSelection market="jp" />,
});
