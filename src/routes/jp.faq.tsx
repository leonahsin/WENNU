import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/site/FaqPage";

export const Route = createFileRoute("/jp/faq")({
  head: () => ({
    meta: [
      { title: "PCI01 FAQ | WENNU サポート 日本" },
      {
        name: "description",
        content:
          "PCI01 のよくあるご質問、お手入れと保管、電源、画面、測定値などの症状別確認手順をご案内します。",
      },
      { property: "og:title", content: "PCI01 FAQ | WENNU サポート" },
      {
        property: "og:description",
        content:
          "よくあるご質問、お手入れと保管、症状別の確認手順をひとつにまとめた日本向けサポートです。",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/jp/faq" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/faq" },
      { rel: "alternate", hrefLang: "en-US", href: "/faq" },
      { rel: "alternate", hrefLang: "x-default", href: "/faq" },
    ],
  }),
  component: () => <FaqPage market="jp" />,
});
