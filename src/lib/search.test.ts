import { describe, expect, it } from "vitest";
import { buildSearchKeys, matchesSearch } from "./search";
import { FAQ_ITEMS } from "@/content/support";

const indexed = FAQ_ITEMS.map((item) => ({
  item,
  keys: buildSearchKeys([item.question, item.answer, item.category, item.keywords]),
}));

function search(query: string, category = "All") {
  return indexed
    .filter(
      ({ item, keys }) =>
        (category === "All" || item.category === category) && matchesSearch(query, keys),
    )
    .map(({ item }) => item.id);
}

describe("FAQ search", () => {
  it("shows all items for an empty query", () => {
    expect(search("")).toHaveLength(FAQ_ITEMS.length);
    expect(search("   ")).toHaveLength(FAQ_ITEMS.length);
  });

  it("matches only battery items for battery/batteries", () => {
    expect(search("battery")).toEqual(["batteries"]);
    expect(search("batteries")).toEqual(["batteries"]);
    expect(search("BATTERY")).toEqual(["batteries"]);
  });

  it("matches only the backlight item for orange", () => {
    expect(search("orange")).toEqual(["orange-backlight"]);
  });

  it("matches the sound-alert item for sound", () => {
    expect(search("sound")).toEqual(["sound-alerts"]);
  });

  it("matches the connectivity item for wifi", () => {
    expect(search("wifi")).toEqual(["app-wifi"]);
  });

  it("ANDs category filters with the query", () => {
    expect(search("battery", "Product & Care")).toEqual(["batteries"]);
    expect(search("battery", "Getting Started")).toEqual([]);
  });
});
