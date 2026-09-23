import { createFileRoute } from "@tanstack/react-router";
import { Pci01SupportHome } from "@/components/site/Pci01SupportHome";

export const Route = createFileRoute("/product/pci01")({
  validateSearch: (search: Record<string, unknown>): { source?: "qr"; q?: string } => ({
    ...(search["source"] === "qr" ? { source: "qr" as const } : {}),
    ...(typeof search["q"] === "string" && search["q"].trim() ? { q: search["q"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "PCI01 Support — Getting Started, Care, FAQ and Support" },
      {
        name: "description",
        content:
          "PCI01 support home: getting started, cleaning and care, FAQ, troubleshooting and support requests.",
      },
      { property: "og:title", content: "PCI01 Support" },
      {
        property: "og:description",
        content: "Guides, care, FAQ, troubleshooting and support requests for PCI01.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/product/pci01" },
      { rel: "alternate", hrefLang: "en-US", href: "/product/pci01" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/product/pci01" },
      { rel: "alternate", hrefLang: "x-default", href: "/product/pci01" },
    ],
  }),
  component: ProductSupport,
});

function ProductSupport() {
  const { source, q } = Route.useSearch();
  return (
    <Pci01SupportHome
      market="us"
      entrySource={source === "qr" ? "qr" : "general"}
      initialQuery={q ?? ""}
    />
  );
}
