import { createFileRoute } from "@tanstack/react-router";
import { ProductSelection } from "@/components/site/ProductSelection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WENNU Support — Choose Your Product" },
      {
        name: "description",
        content:
          "Get help with your WENNU product. PCI01 support covers how to use it, understanding readings, video guidance and common questions.",
      },
      { property: "og:title", content: "WENNU Support — Choose Your Product" },
      {
        property: "og:description",
        content: "Product support for WENNU pet care products, starting with the PCI01.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "alternate", hrefLang: "en-US", href: "/" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: () => <ProductSelection market="us" />,
});
