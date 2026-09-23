/**
 * How to Use — one continuous instructional page per locale.
 *
 * Section IDs are stable anchors and are linked from FAQ, search and videos.
 *
 * COMPLIANCE: measurement site, exact distance and detailed scanning
 * requirements are NOT approved for publication. Those sections keep their
 * position and use non-specific wording plus a visible review notice. The
 * previously removed "7 seconds" claim must never be reintroduced.
 *
 * INTERNAL (not customer facing): approved wording for `position-the-thermometer`
 * is pending owner confirmation.
 */

import type { MarketId } from "./market";

export type HowToSectionId =
  "choose-your-mode" | "position-the-thermometer" | "keep-scanning" | "learn-their-normal";

export interface HowToSection {
  id: HowToSectionId;
  navLabel: string;
  title: string;
  summary: string;
  body: string[];
  /** Emphasised, high-priority section. */
  emphasis?: boolean;
  /** Awaiting approved wording — a review notice is shown instead of details. */
  pendingReview?: boolean;
  /** Keywords used by unified search. */
  keywords: string[];
}

export const HOW_TO_SECTIONS_US: HowToSection[] = [
  {
    id: "choose-your-mode",
    navLabel: "Choose your mode",
    title: "Choose your mode",
    summary: "Set PCI01 to dog or cat before you start.",
    body: [
      "Turn PCI01 on and pick the setting that matches the pet in front of you: dog or cat.",
      "Keep one history per pet — readings from different pets aren't comparable.",
    ],
    keywords: ["mode", "dog", "cat", "setting", "start", "begin", "switch"],
  },
  {
    id: "position-the-thermometer",
    navLabel: "Position PCI01",
    title: "Position PCI01",
    summary: "Find the right spot and keep a steady, repeatable distance.",
    body: [
      "Pick a calm moment, part the coat gently with the comb teeth, and keep your pet relaxed.",
      "Do it the same way every time so your readings stay comparable, and hold PCI01 at the same distance from one session to the next.",
      "Follow the official instructions supplied with your device for the recommended measuring position.",
    ],
    keywords: [
      "spot",
      "where",
      "position",
      "place",
      "coat",
      "fur",
      "location",
      "distance",
      "close",
      "far",
      "how close",
      "hold",
      "near",
    ],
  },
  {
    id: "keep-scanning",
    navLabel: "Keep scanning",
    title: "Keep scanning",
    summary: "Keep the reading going, and take more than one.",
    body: [
      "Keep moving PCI01 slowly over the same spot — don't stop after a second or two. A steady reading tells you more than a quick one.",
      "Take a few readings in the same session instead of trusting just one, and compare them against your pet's usual trend.",
      "If a reading looks off, calm your pet, wait a moment, and try again under the same conditions.",
    ],
    emphasis: true,
    keywords: [
      "keep scanning",
      "scan",
      "scanning",
      "again",
      "repeat",
      "steady",
      "reading",
      "wrong",
      "varies",
      "inconsistent",
    ],
  },
  {
    id: "learn-their-normal",
    navLabel: "Learn their normal",
    title: "Learn their normal",
    summary: "Build the everyday baseline that belongs to your pet.",
    body: [
      "Use PCI01 at similar times, in similar places, and the same way each time.",
      "After a while you'll know what's normal for your pet, so anything unusual stands out.",
      "Readings are a trend reference for everyday care, not a diagnosis. Check with a veterinarian whenever you're concerned.",
    ],
    keywords: ["normal", "baseline", "usual", "trend", "routine", "history"],
  },
];

export const HOW_TO_SECTIONS_JP: HowToSection[] = [
  {
    id: "choose-your-mode",
    navLabel: "モードを選ぶ",
    title: "モードを選ぶ",
    summary: "はじめに、犬用か猫用かを選びます。",
    body: [
      "PCI01 の電源を入れ、目の前のペットに合わせて犬用または猫用の設定をお選びください。",
      "記録はペットごとに分けてお使いください。別のペットの数値どうしは比べられません。",
    ],
    keywords: ["モード", "犬", "猫", "設定", "はじめ", "切り替え"],
  },
  {
    id: "position-the-thermometer",
    navLabel: "位置と距離を整える",
    title: "位置と距離を整える",
    summary: "当てる位置を確認し、毎回同じ距離感を保ちます。",
    body: [
      "落ち着いているタイミングで、コームの歯でやさしく毛をかき分け、ペットがリラックスした状態でお使いください。",
      "毎回同じ進め方にそろえると、数値を比べやすくなります。",
      "本体を安定させ、毎回できるだけ同じ距離感でお使いください。",
      "製品に付属の公式説明書に従ってください。",
    ],
    pendingReview: true,
    keywords: [
      "位置",
      "どこ",
      "場所",
      "毛",
      "被毛",
      "当てる",
      "距離",
      "近づける",
      "離す",
      "どのくらい",
    ],
  },
  {
    id: "keep-scanning",
    navLabel: "続けて測る",
    title: "続けて測る",
    summary: "測定を途中で止めず、複数回ご確認ください。",
    body: [
      "すぐに止めず、同じ範囲を安定した動きで続けてお使いください。落ち着いた数値のほうが参考になります。",
      "1回の数値だけに頼らず、同じ場面で数回ご確認いただき、ふだんの傾向と見比べてください。",
      "気になる数値が出たときは、ペットを落ち着かせ、少し時間をおいて同じ条件でもう一度ご確認ください。",
    ],
    emphasis: true,
    keywords: ["続けて", "測定", "スキャン", "もう一度", "ばらつく", "おかしい", "数値"],
  },
  {
    id: "learn-their-normal",
    navLabel: "ふだんの目安を知る",
    title: "ふだんの目安を知る",
    summary: "その子ならではの毎日の目安をつくります。",
    body: [
      "できるだけ同じ時間帯・同じ環境で、同じ方法で続けてお使いください。",
      "続けるうちにふだんの状態がつかめ、いつもと違う傾向に気づきやすくなります。",
      "測定値は毎日のケアのための傾向の参考であり、診断ではありません。ご心配なときは獣医師にご相談ください。",
    ],
    keywords: ["ふだん", "目安", "基準", "傾向", "習慣", "記録"],
  },
];

export function howToSections(market: MarketId): HowToSection[] {
  return market === "jp" ? HOW_TO_SECTIONS_JP : HOW_TO_SECTIONS_US;
}

/** Visible notice used where approved Japanese wording is still being prepared. */
export const HOW_TO_REVIEW_NOTICE_JP =
  "この手順の詳しいご案内は確認中です。製品に付属の公式説明書をご確認ください。";
