import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { VIDEO_GUIDES } from "@/content/videos";

const files = [
  "src/components/site/FaqPage.tsx",
  "src/content/support.ts",
  "src/content/jp/support.ts",
  "src/content/jp/products.ts",
  "src/content/videos.ts",
];

// The JP draft notice deliberately states that cleaning-agent guidance is still
// unconfirmed; it makes no claim, so it is excluded from the claim scan.
const text = files
  .map((f) => readFileSync(f, "utf8"))
  .join("\n")
  .split("\n")
  .filter((line) => !line.includes("JpDraftNotice"))
  .join("\n");

describe("cleaning specification compliance", () => {
  it("never describes the device body as washable or waterproof", () => {
    for (const term of [
      "washable silicone tip",
      "the device is washable",
      "waterproof",
      "防水",
      "本体は洗え",
      "本体全体を水に浸け",
      "dishwasher",
    ]) {
      expect(text).not.toContain(term);
    }
  });

  it("states both approved silicone parts may be washed", () => {
    const us = readFileSync("src/components/site/FaqPage.tsx", "utf8");
    expect(us).toContain("blue silicone cover can be hand-washed");
    expect(us).toContain("comb teeth can be rinsed with water");
    expect(us).toContain("Never wash or soak the device body");

    const jp = readFileSync("src/components/site/FaqPage.tsx", "utf8");
    expect(jp).toContain("シリコンカバーは、手洗いできます");
    expect(jp).toContain("コームの歯は、水で洗えます");
    expect(jp).toContain("本体は水で洗ったり、水に浸けたりしないでください");
  });

  it("keeps cleaning video guides honest and unpublished", () => {
    const cleaning = VIDEO_GUIDES.filter((v) => v.id.endsWith("clean-tip"));
    expect(cleaning).toHaveLength(2);
    for (const v of cleaning) {
      expect(v.videoUrl).toBeNull();
      expect(v.duration).toBeNull();
      expect(v.published).toBe(false);
    }
    expect(cleaning.map((v) => v.title)).toEqual(["Cleaning PCI01", "PCI01 のお手入れ"]);
  });

  it("does not invent detergents, temperatures or timings", () => {
    for (const term of [
      "soap",
      "detergent",
      "alcohol",
      "disinfect",
      "steriliz",
      "IP67",
      "ぬるま湯",
      "洗剤",
      "アルコール",
      "消毒",
      "殺菌",
    ]) {
      expect(text.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });
});
