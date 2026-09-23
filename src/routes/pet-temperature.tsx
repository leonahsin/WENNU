import { createFileRoute } from "@tanstack/react-router";
import { PetTemperaturePage } from "@/components/site/PetTemperaturePage";

export const Route = createFileRoute("/pet-temperature")({
  head: () => ({
    meta: [
      { title: "Pet Temperature — Understanding Everyday Readings" },
      {
        name: "description",
        content:
          "General, non-diagnostic guidance on what changes a pet's temperature, why readings vary and how to build a personal baseline with the PCI01.",
      },
      { property: "og:title", content: "Understanding Pet Temperature" },
      {
        property: "og:description",
        content: "Everyday-care education about pet temperature trends. Not a diagnostic tool.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/pet-temperature" },
      { rel: "alternate", hrefLang: "en-US", href: "/pet-temperature" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/pet-temperature" },
      { rel: "alternate", hrefLang: "x-default", href: "/pet-temperature" },
    ],
  }),
  component: () => <PetTemperaturePage market="us" />,
});
