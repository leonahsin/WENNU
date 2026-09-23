/**
 * Japanese product content.
 *
 * The physical product is identical to the U.S. market: one PCI01 Pet
 * Thermometer. Only hardware facts that are confirmed as common to the same
 * physical device are stated here (battery type, stored record count, minimum
 * continuous scanning time, silicone cover handling, dog / cat usage guides).
 *
 * Market-specific items (同梱物・保証・販売経路・問い合わせ窓口 など) are NOT
 * defined here. They must be shown with the Japanese internal draft notice.
 */

export interface JpUsageGuide {
  id: "dog" | "cat";
  name: string;
  summary: string;
}

export const JP_PCI01 = {
  id: "pci01",
  name: "PCI01 ペット用体温計",
  shortName: "PCI01",
  category: "ペット用体温計",
  summary:
    "本体は1機種のみです。犬用ガイドと猫用ガイドは、同じ製品の使い方ガイドであり、別売りの別製品ではありません。",
  batteries: "単4形1.5Vアルカリ乾電池2本",
  storedRecords: 30,
  minScanSeconds: 7,
  guides: [
    {
      id: "dog",
      name: "犬用ガイド",
      summary: "犬を測定するときの持ち方と当て方をご案内します。本体は共通です。",
    },
    {
      id: "cat",
      name: "猫用ガイド",
      summary: "猫を測定するときの持ち方と当て方をご案内します。本体は共通です。",
    },
  ] as JpUsageGuide[],
} as const;

export const JP_COVER_STATES: { id: "without-cover" | "with-cover"; label: string; description: string }[] =
  [
    {
      id: "without-cover",
      label: "シリコンカバーを外した状態",
      description: "本体のみでご使用の状態です。電池交換の際は、そのまま裏ぶたを開けられます。",
    },
    {
      id: "with-cover",
      label: "ブルーのシリコンカバーを装着した状態",
      description:
        "本体にシリコンカバーを装着した状態です。裏ぶたを開ける前に、必ずカバーを取り外してください。",
    },
  ];

/** Facts that are confirmed as common to the same physical product. */
export const JP_COMMON_FACTS: string[] = [
  "電池は単4形1.5V乾電池を2本使用します。",
  "1回の測定は、途中で離さず続けて当ててください。",
  "測定値は最大30件まで本体に保存されます。",
  "取り外したブルーのシリコンカバーは手洗いできます。シリコン製の測定先端とコームの歯は水で洗えます。本体は水で洗ったり水に浸けたりしないでください。",
  "裏ぶたを開ける前に、ブルーのシリコンカバーを必ず取り外してください。",
];
