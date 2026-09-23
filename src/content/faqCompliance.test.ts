import { describe, expect, it } from "vitest";
import { FAQ_ITEMS, FAQ_PRINCIPLES, FAQ_CATEGORIES } from "@/content/support";
import { JP_FAQ_ITEMS, JP_FAQ_PRINCIPLES, JP_FAQ_CATEGORIES } from "@/content/jp/support";

const usText = [
  ...FAQ_ITEMS.flatMap((i) => [i.question, i.answer, i.category, ...(i.keywords ?? [])]),
  ...FAQ_PRINCIPLES,
  ...FAQ_CATEGORIES,
]
  .join(" ")
  .toLowerCase();

const jpText = [
  ...JP_FAQ_ITEMS.flatMap((i) => [i.question, i.answer, i.category, ...i.keywords]),
  ...JP_FAQ_PRINCIPLES,
  ...JP_FAQ_CATEGORIES,
].join(" ");

const US_PROHIBITED = [
  "7 second",
  "seven second",
  "30 record",
  "30 reading",
  "washable",
  "waterproof",
  "immerse",
  "wash",
  "clinical",
  "veterinary-grade",
  "medical-grade",
  "core body temperature",
  "core temperature",
  "bluetooth",
  "accuracy",
  "accurate",
  "precision",
  "rectal",
  "oral temperature",
  "high version",
  "low version",
];

const JP_PROHIBITED = [
  "7秒",
  "七秒",
  "30件",
  "洗え",
  "洗う",
  "洗浄",
  "水洗い",
  "防水",
  "深部体温",
  "臨床",
  "医療グレード",
  "獣医療グレード",
  "高精度",
  "正確",
  "bluetooth",
  "ブルートゥース",
  "直腸",
];

describe("FAQ compliance", () => {
  it("keeps exactly the 11 approved topics in both locales", () => {
    expect(FAQ_ITEMS).toHaveLength(11);
    expect(JP_FAQ_ITEMS).toHaveLength(FAQ_ITEMS.length);
    expect(JP_FAQ_ITEMS.map((i) => i.id)).toEqual(FAQ_ITEMS.map((i) => i.id));
  });

  it("contains no prohibited U.S. claims", () => {
    for (const term of US_PROHIBITED) expect(usText).not.toContain(term);
  });

  it("contains no prohibited Japanese claims", () => {
    for (const term of JP_PROHIBITED) expect(jpText).not.toContain(term);
  });

  it("does not expose internal draft notes", () => {
    for (const term of ["internal draft", "not ready to publish", "version 2", "checklist"]) {
      expect(usText).not.toContain(term);
    }
    for (const term of ["社内", "ドラフト", "版数", "チェックリスト"]) {
      expect(jpText).not.toContain(term);
    }
  });

  it("frames the high-temperature alert as attention, not a fever diagnosis", () => {
    expect(FAQ_PRINCIPLES.join(" ")).toContain("not a diagnosis");
    expect(JP_FAQ_PRINCIPLES.join(" ")).toContain("発熱の診断ではありません");
    expect(FAQ_ITEMS.map((i) => `${i.question} ${i.answer}`).join(" ")).not.toMatch(/fever/i);
    expect(JP_FAQ_ITEMS.map((i) => `${i.question} ${i.answer}`).join(" ")).not.toContain("発熱");
  });

  it("keeps the four approved principles per locale", () => {
    expect(FAQ_PRINCIPLES).toHaveLength(4);
    expect(JP_FAQ_PRINCIPLES).toHaveLength(4);
  });
});
