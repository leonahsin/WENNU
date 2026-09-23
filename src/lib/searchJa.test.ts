import { describe, expect, it } from "vitest";
import { buildJaHaystack, matchesJaSearch, normalizeJa } from "@/lib/searchJa";
import { JP_FAQ_ITEMS } from "@/content/jp/support";

const indexed = JP_FAQ_ITEMS.map((item) => ({
  id: item.id,
  haystack: buildJaHaystack([item.question, item.answer, item.category, item.keywords]),
}));

function search(query: string, category?: string) {
  return indexed
    .filter((entry) =>
      category ? JP_FAQ_ITEMS.find((i) => i.id === entry.id)?.category === category : true,
    )
    .filter((entry) => matchesJaSearch(query, entry.haystack))
    .map((entry) => entry.id);
}

describe("Japanese FAQ search", () => {
  it("returns every item for an empty query", () => {
    expect(search("")).toHaveLength(JP_FAQ_ITEMS.length);
    expect(search("   ")).toHaveLength(JP_FAQ_ITEMS.length);
  });

  it("matches battery questions for 電池 and バッテリー", () => {
    expect(search("電池")).toEqual(["batteries"]);
    expect(search("バッテリー")).toEqual(["batteries"]);
  });

  it("matches only the orange backlight FAQ", () => {
    expect(search("オレンジ")).toEqual(["orange-backlight"]);
  });

  it("matches the connectivity FAQ for アプリ", () => {
    expect(search("アプリ")).toEqual(["app-wifi"]);
  });

  it("ANDs multiple chunks instead of ORing them", () => {
    expect(search("電池 犬")).toEqual([]);
    expect(search("犬 比べ")).toEqual(["dogs-and-cats"]);
  });

  it("ANDs the category filter with the query", () => {
    expect(search("電池", "製品とお手入れ")).toEqual(["batteries"]);
    expect(search("電池", "はじめに")).toEqual([]);
  });

  it("normalizes full-width and case differences", () => {
    expect(normalizeJa("ＰＣＩ０１")).toBe("pci01");
    expect(search("ＰＣＩ０１").length).toBeGreaterThan(0);
  });
});
