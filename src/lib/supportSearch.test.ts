import { describe, expect, it } from "vitest";
import { groupResults, searchSupport } from "@/lib/supportSearch";
import { HOW_TO_SECTIONS_US, howToSections } from "@/content/howToUse";
import { FAQ_LINKS } from "@/content/faqLinks";
import { FAQ_ITEMS } from "@/content/support";
import { VIDEO_RELATED, VIDEO_ORDER, videosForMarket } from "@/content/videos";
import { homeDestination } from "@/lib/supportSession";

describe("unified support search", () => {
  it("returns nothing for an empty query", () => {
    expect(searchSupport("us", "")).toEqual([]);
    expect(searchSupport("jp", "   ")).toEqual([]);
  });

  it("puts the most relevant approved answer first for 'temperature wrong'", () => {
    const results = searchSupport("us", "temperature wrong");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.type).toBe("faq");
    const types = groupResults(results).map((g) => g.type);
    expect(types).toEqual(
      types.slice().sort((a, b) => {
        const order = ["faq", "how-to-use", "troubleshooting", "video"];
        return order.indexOf(a) - order.indexOf(b);
      }),
    );
  });

  it("finds Getting Started sections and links to their anchors", () => {
    const results = searchSupport("us", "keep scanning");
    const howTo = results.find((r) => r.type === "how-to-use");
    expect(howTo?.to).toBe("/getting-started#keep-scanning");
  });

  it("returns one direct answer for each homepage preset", () => {
    expect(searchSupport("us", "How do I measure?")).toHaveLength(1);
    expect(searchSupport("us", "How do I measure?")[0]?.to).toBe("/getting-started");
    expect(searchSupport("us", "How do I clean it?")[0]?.to).toBe("/faq#cleaning-care");
    expect(searchSupport("us", "What does orange mean?")[0]?.to).toBe("/faq#faq-orange-backlight");
    expect(searchSupport("us", "What batteries does PCI01 use?")[0]?.to).toBe("/faq#faq-batteries");
    expect(searchSupport("us", "Can dogs and cats both use it?")[0]?.to).toBe(
      "/faq#faq-dogs-and-cats",
    );
    expect(searchSupport("us", "Does it need an app or Wi-Fi?")[0]?.to).toBe("/faq#faq-app-wifi");
    expect(searchSupport("us", "What should I do after a high-temperature alert?")[0]?.to).toBe(
      "/faq#faq-after-alert",
    );
    expect(searchSupport("us", "Talk to a human")[0]?.to).toBe("/support-request");
  });

  it("tolerates simple misspellings and casual wording", () => {
    expect(searchSupport("us", "batery").length).toBeGreaterThan(0);
    expect(searchSupport("us", "temprature").length).toBeGreaterThan(0);
  });

  it("works in Japanese and keeps /jp destinations", () => {
    const results = searchSupport("jp", "数値がおかしい");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.to.startsWith("/jp/"))).toBe(true);
  });

  it("never surfaces compliance-review or draft text", () => {
    for (const market of ["us", "jp"] as const) {
      for (const query of ["compliance", "draft", "internal", "確認中", "プレビュー"]) {
        for (const result of searchSupport(market, query)) {
          expect(result.snippet).not.toMatch(/compliance review|internal draft|プレビューのみ/i);
        }
      }
    }
  });
});

describe("architecture wiring", () => {
  it("keeps QR visitors on the PCI01 support home", () => {
    expect(homeDestination("en-US", "qr")).toBe("/product/pci01");
    expect(homeDestination("ja-JP", "qr")).toBe("/jp/product/pci01");
    expect(homeDestination("en-US", "general")).toBe("/");
    expect(homeDestination("ja-JP", "general")).toBe("/jp");
  });

  it("uses the approved How to Use anchors in order", () => {
    expect(HOW_TO_SECTIONS_US.map((s) => s.id)).toEqual([
      "choose-your-mode",
      "position-the-thermometer",
      "keep-scanning",
      "learn-their-normal",
    ]);
    expect(HOW_TO_SECTIONS_US.find((s) => s.id === "keep-scanning")?.emphasis).toBe(true);
    expect(howToSections("jp").map((s) => s.id)).toEqual(HOW_TO_SECTIONS_US.map((s) => s.id));
  });

  it("never reintroduces the removed 7-second claim", () => {
    for (const market of ["us", "jp"] as const) {
      const text = JSON.stringify(howToSections(market));
      expect(text).not.toMatch(/7 seconds|7秒/);
    }
  });

  it("gives every video a stable anchor and resolvable related links", () => {
    for (const market of ["us", "jp"] as const) {
      for (const video of videosForMarket(market)) {
        expect(video.anchor).toBe(`video-${video.baseId}`);
        const links = VIDEO_RELATED[video.baseId];
        if (links?.faqId) expect(FAQ_ITEMS.some((f) => f.id === links.faqId)).toBe(true);
        if (links?.howTo)
          expect(howToSections(market).some((s) => s.id === links.howTo)).toBe(true);
      }
    }
  });

  it("maps every FAQ item to resolvable learn-more links", () => {
    for (const item of FAQ_ITEMS) {
      const links = FAQ_LINKS[item.id];
      if (!links) continue;
      if (links.howTo) expect(HOW_TO_SECTIONS_US.some((s) => s.id === links.howTo)).toBe(true);
      if (links.videoBaseId)
        expect((VIDEO_ORDER as readonly string[]).includes(links.videoBaseId)).toBe(true);
    }
  });
});
