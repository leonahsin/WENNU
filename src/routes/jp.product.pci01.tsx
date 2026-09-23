import { createFileRoute } from "@tanstack/react-router";
import { Pci01SupportHome } from "@/components/site/Pci01SupportHome";

export const Route = createFileRoute("/jp/product/pci01")({
  validateSearch: (search: Record<string, unknown>): { source?: "qr"; q?: string } => ({
    ...(search["source"] === "qr" ? { source: "qr" as const } : {}),
    ...(typeof search["q"] === "string" && search["q"].trim() ? { q: search["q"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "PCI01 サポート | 使い方・体温・動画・よくあるご質問" },
      {
        name: "description",
        content:
          "PCI01 のサポートホーム。使い方、ペットの体温の見かた、動画ガイド、よくあるご質問を検索できます。",
      },
      { property: "og:title", content: "PCI01 サポート" },
      {
        property: "og:description",
        content: "使い方・ペットの体温・動画ガイド・よくあるご質問をご案内します。",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/jp/product/pci01" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/product/pci01" },
      { rel: "alternate", hrefLang: "en-US", href: "/product/pci01" },
      { rel: "alternate", hrefLang: "x-default", href: "/product/pci01" },
    ],
  }),
  component: JpProductSupport,
});

function JpProductSupport() {
  const { source, q } = Route.useSearch();
  return (
    <Pci01SupportHome
      market="jp"
      entrySource={source === "qr" ? "qr" : "general"}
      initialQuery={q ?? ""}
    />
  );
}
