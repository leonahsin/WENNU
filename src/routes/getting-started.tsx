import { createFileRoute } from "@tanstack/react-router";
import { HowToUsePage } from "@/components/site/HowToUsePage";

export const Route = createFileRoute("/getting-started")({
  head: () => ({
    meta: [
      { title: "Getting Started with PCI01 — Step by Step" },
      {
        name: "description",
        content:
          "Choose a mode, position the PCI01, keep scanning and learn your pet's everyday normal.",
      },
      { property: "og:title", content: "Getting Started with PCI01" },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "/getting-started" },
      { rel: "alternate", hrefLang: "en-US", href: "/getting-started" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/getting-started" },
      { rel: "alternate", hrefLang: "x-default", href: "/getting-started" },
    ],
  }),
  component: () => <HowToUsePage market="us" />,
});
