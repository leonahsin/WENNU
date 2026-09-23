import { describe, expect, it } from "vitest";
import { JP_POPULAR_HELP, JP_PRIMARY_CARDS, US_POPULAR_HELP, US_PRIMARY_CARDS } from "./home";
import { FOOTER_LINKS_JP, FOOTER_LINKS_US, PUBLIC_NAV_JP, PUBLIC_NAV_US } from "./navigation";
import { VIDEO_GUIDES, featuredVideo, filterVideos, isPlayable } from "./videos";

describe("homepage information architecture", () => {
  it("shows exactly three primary cards per market", () => {
    expect(US_PRIMARY_CARDS).toHaveLength(3);
    expect(JP_PRIMARY_CARDS).toHaveLength(3);
  });

  it("points the US primary cards at videos, troubleshooting and contact", () => {
    expect(US_PRIMARY_CARDS.map((c) => c.to)).toEqual(["/videos", "/troubleshooting", "/contact"]);
    expect(JP_PRIMARY_CARDS.map((c) => c.to)).toEqual([
      "/jp/videos",
      "/jp/troubleshooting",
      "/jp/contact",
    ]);
  });

  it("keeps popular help compact and market-scoped", () => {
    expect(US_POPULAR_HELP).toHaveLength(2);
    expect(JP_POPULAR_HELP).toHaveLength(2);
    expect(US_POPULAR_HELP.map((l) => l.to)).toEqual(["/getting-started", "/faq"]);
    expect(US_POPULAR_HELP.every((l) => !l.to.startsWith("/jp"))).toBe(true);
    expect(JP_POPULAR_HELP.every((l) => l.to.startsWith("/jp"))).toBe(true);
  });
});

describe("simplified navigation", () => {
  it("keeps only four public header links per market", () => {
    expect(PUBLIC_NAV_US).toHaveLength(4);
    expect(PUBLIC_NAV_JP).toHaveLength(4);
    expect(PUBLIC_NAV_US.map((n) => n.to)).toEqual([
      "/",
      "/videos",
      "/troubleshooting",
      "/contact",
    ]);
  });

  it("keeps FAQ in the footer and removes retired standalone routes", () => {
    const us = FOOTER_LINKS_US.map((l) => l.to);
    expect(us).toContain("/faq");
    expect(us).not.toContain("/warranty-returns");
    expect(us).not.toContain("/cleaning-care");
    expect(PUBLIC_NAV_US.map((n) => n.to)).not.toContain("/faq");
    const jp = FOOTER_LINKS_JP.map((l) => l.to);
    expect(jp.every((to) => to.startsWith("/jp"))).toBe(true);
  });
});

describe("homepage emphasis", () => {
  it("makes video guides the single dominant action per market", () => {
    for (const cards of [US_PRIMARY_CARDS, JP_PRIMARY_CARDS]) {
      expect(cards.filter((c) => c.emphasis === "primary")).toHaveLength(1);
      expect(cards.find((c) => c.emphasis === "primary")?.id).toBe("videos");
    }
  });
});

describe("video guides", () => {
  it("orders the seven approved guides consistently in both markets", () => {
    for (const market of ["us", "jp"] as const) {
      const ids = filterVideos(market, "all").map((v) => v.id.replace(`${market}-`, ""));
      expect(ids).toEqual([
        "overview",
        "memory",
        "dogs",
        "cats",
        "keep-scanning",
        "clean-tip",
        "remove-cover-battery",
      ]);
      expect(featuredVideo(market)?.id).toBe(`${market}-overview`);
    }
  });

  it("keeps every guide an honest coming-soon placeholder", () => {
    expect(VIDEO_GUIDES.every((v) => v.videoUrl === null && !v.published)).toBe(true);
  });

  it("provides seven structured placeholders per market", () => {
    expect(filterVideos("us", "all")).toHaveLength(7);
    expect(filterVideos("jp", "all")).toHaveLength(7);
  });

  it("filters by category within a single market", () => {
    const usStart = filterVideos("us", "getting-started");
    expect(usStart.length).toBeGreaterThan(0);
    expect(usStart.every((v) => v.market === "us" && v.category === "getting-started")).toBe(true);
    expect(filterVideos("jp", "getting-started").every((v) => v.market === "jp")).toBe(true);
  });

  it("keeps dog and cat guides as separate entries", () => {
    for (const market of ["us", "jp"] as const) {
      const ids = filterVideos(market, "all").map((v) => v.id);
      expect(ids.some((id) => id.includes("dog"))).toBe(true);
      expect(ids.some((id) => id.includes("cat"))).toBe(true);
    }
  });

  it("treats unpublished placeholders as coming soon", () => {
    expect(VIDEO_GUIDES.every((v) => isPlayable(v) === (v.published && !!v.videoUrl))).toBe(true);
  });

  it("uses the correct locale per market", () => {
    expect(filterVideos("us", "all").every((v) => v.locale === "en-US")).toBe(true);
    expect(filterVideos("jp", "all").every((v) => v.locale === "ja-JP")).toBe(true);
  });
});
