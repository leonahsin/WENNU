import { createFileRoute } from "@tanstack/react-router";
import { PetTemperaturePage } from "@/components/site/PetTemperaturePage";

export const Route = createFileRoute("/jp/pet-temperature")({
  head: () => ({
    meta: [
      { title: "ペットの体温について | WENNU サポート 日本" },
      {
        name: "description",
        content:
          "体温に影響するもの、数値がばらつく理由、その子ならではの目安のつくり方を、診断を目的としない一般情報としてご案内します。",
      },
      { property: "og:title", content: "ペットの体温について" },
      {
        property: "og:description",
        content: "毎日のケアのための一般的なご案内です。診断を行うものではありません。",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/jp/pet-temperature" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/pet-temperature" },
      { rel: "alternate", hrefLang: "en-US", href: "/pet-temperature" },
      { rel: "alternate", hrefLang: "x-default", href: "/pet-temperature" },
    ],
  }),
  component: () => <PetTemperaturePage market="jp" />,
});
