import { createFileRoute } from "@tanstack/react-router";
import { VideoGuidesPage } from "@/components/site/VideoGuidesPage";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "PCI01 Video Guides — Setup, Measuring and Care" },
      {
        name: "description",
        content:
          "Step-by-step PCI01 video guides for setup, memory, measuring dogs and cats, repeat scanning, cleaning and silicone-cover care.",
      },
      { property: "og:title", content: "PCI01 Video Guides" },
      {
        property: "og:description",
        content: "Short video guides for setting up, using and caring for the PCI01.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/videos" },
      { rel: "alternate", hrefLang: "en-US", href: "/videos" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/videos" },
      { rel: "alternate", hrefLang: "x-default", href: "/videos" },
    ],
  }),
  component: () => <VideoGuidesPage market="us" />,
});
