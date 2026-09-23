import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/site/FaqPage";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "PCI01 FAQ | WENNU Support" },
      {
        name: "description",
        content:
          "Search PCI01 answers, follow safe cleaning and care steps, and use guided troubleshooting for common issues.",
      },
      { property: "og:title", content: "PCI01 FAQ | WENNU Support" },
      {
        property: "og:description",
        content:
          "Common answers, cleaning and care, and troubleshooting in one PCI01 support page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/faq" },
      { rel: "alternate", hrefLang: "en-US", href: "/faq" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/faq" },
      { rel: "alternate", hrefLang: "x-default", href: "/faq" },
    ],
  }),
  component: () => <FaqPage market="us" />,
});
