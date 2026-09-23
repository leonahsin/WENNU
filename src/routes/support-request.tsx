import { createFileRoute } from "@tanstack/react-router";
import { SimpleSupportRequest } from "@/components/site/SimpleSupportRequest";

export const Route = createFileRoute("/support-request")({
  head: () => ({
    meta: [
      { title: "Support Request | WENNU PCI01 Support" },
      {
        name: "description",
        content:
          "Send a brief PCI01 product support request. Additional photos, video or serial details are requested only when needed.",
      },
      { property: "og:title", content: "Support Request | WENNU PCI01 Support" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "/support-request" },
      { rel: "alternate", hrefLang: "en-US", href: "/support-request" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/support-request" },
    ],
  }),
  component: () => <SimpleSupportRequest market="us" />,
});
