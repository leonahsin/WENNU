import { createFileRoute } from "@tanstack/react-router";
import { SimpleSupportRequest } from "@/components/site/SimpleSupportRequest";

export const Route = createFileRoute("/jp/support-request")({
  head: () => ({
    meta: [
      { title: "サポート依頼 | WENNU PCI01 サポート" },
      {
        name: "description",
        content:
          "PCI01 製品について、必要な情報だけで簡単にサポートを依頼できます。写真・動画・製造番号は必要な場合のみ後ほど確認します。",
      },
      { property: "og:title", content: "サポート依頼 | WENNU PCI01 サポート" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ja_JP" },
    ],
    links: [
      { rel: "canonical", href: "/jp/support-request" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/support-request" },
      { rel: "alternate", hrefLang: "en-US", href: "/support-request" },
    ],
  }),
  component: () => <SimpleSupportRequest market="jp" />,
});
