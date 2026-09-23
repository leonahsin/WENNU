/**
 * Pet Temperature — general, explicitly non-diagnostic education.
 *
 * COMPLIANCE: no numerical ranges, no fever thresholds, no diagnosis and no
 * veterinary decision rules may be published. Reference-range sections state
 * that professionally reviewed guidance is being prepared.
 *
 * INTERNAL (not customer facing): dog/cat reference range content awaits
 * professional review before it can be published.
 */

import type { MarketId } from "./market";

export type PetTemperatureSectionId =
  | "every-pet-has-a-normal"
  | "dog-reference-range"
  | "cat-reference-range"
  | "what-changes-temperature"
  | "why-readings-vary"
  | "building-a-personal-baseline"
  | "when-to-seek-veterinary-guidance";

export interface PetTemperatureSection {
  id: PetTemperatureSectionId;
  title: string;
  body: string[];
  /** True while professionally reviewed guidance is still being prepared. */
  pendingReview?: boolean;
  keywords: string[];
}

export const PET_TEMPERATURE_US: PetTemperatureSection[] = [
  {
    id: "every-pet-has-a-normal",
    title: "Every pet has a normal",
    body: [
      "Two healthy pets can sit at slightly different everyday levels. What matters most is what is usual for your pet.",
      "PCI01 is designed to help you observe that everyday trend over time.",
    ],
    keywords: ["normal", "usual", "baseline", "individual"],
  },
  {
    id: "dog-reference-range",
    title: "Dog reference range",
    body: [],
    pendingReview: true,
    keywords: ["dog", "range", "reference", "numbers"],
  },
  {
    id: "cat-reference-range",
    title: "Cat reference range",
    body: [],
    pendingReview: true,
    keywords: ["cat", "range", "reference", "numbers"],
  },
  {
    id: "what-changes-temperature",
    title: "What changes temperature?",
    body: [
      "Activity, excitement, rest, time of day and the surrounding environment can all influence what you observe.",
      "Grooming, coat condition and how settled your pet is at that moment also play a part.",
    ],
    keywords: ["changes", "affect", "activity", "environment", "weather", "exercise"],
  },
  {
    id: "why-readings-vary",
    title: "Why readings vary",
    body: [
      "A single reading is a snapshot. Small differences between readings are normal and are not, on their own, a sign of a problem.",
      "Keep the conditions and your method as similar as you can, take more than one reading, and look at the trend.",
    ],
    keywords: ["vary", "different", "wrong", "inconsistent", "changes", "reading"],
  },
  {
    id: "building-a-personal-baseline",
    title: "Building a personal baseline",
    body: [
      "Read at similar times, in similar environments, and in a consistent way over several ordinary days.",
      "That everyday picture is what makes an unusual trend easier to notice later.",
    ],
    keywords: ["baseline", "history", "record", "trend", "routine"],
  },
  {
    id: "when-to-seek-veterinary-guidance",
    title: "When to seek veterinary guidance",
    body: [
      "PCI01 does not diagnose anything and does not replace your veterinarian.",
      "If your pet seems unwell, if their energy, appetite or behaviour changes, or if you are simply concerned, contact your veterinarian.",
    ],
    keywords: ["vet", "veterinarian", "help", "concerned", "unwell", "sick"],
  },
];

export const PET_TEMPERATURE_JP: PetTemperatureSection[] = [
  {
    id: "every-pet-has-a-normal",
    title: "その子ならではの「ふだん」があります",
    body: [
      "健康なペットどうしでも、毎日の状態は少しずつ異なります。大切なのは、その子にとってのふだんの状態です。",
      "PCI01 は、その毎日の傾向を続けて観察していただくための製品です。",
    ],
    keywords: ["ふだん", "目安", "個体差"],
  },
  {
    id: "dog-reference-range",
    title: "犬の参考範囲",
    body: [],
    pendingReview: true,
    keywords: ["犬", "範囲", "参考", "数値"],
  },
  {
    id: "cat-reference-range",
    title: "猫の参考範囲",
    body: [],
    pendingReview: true,
    keywords: ["猫", "範囲", "参考", "数値"],
  },
  {
    id: "what-changes-temperature",
    title: "体温に影響するもの",
    body: [
      "運動や興奮、休息、時間帯、まわりの環境などが、観察される数値に影響することがあります。",
      "被毛の状態やお手入れの状況、そのときの落ち着き具合も関係します。",
    ],
    keywords: ["影響", "運動", "環境", "気温"],
  },
  {
    id: "why-readings-vary",
    title: "数値がばらつく理由",
    body: [
      "1回の測定はその瞬間の記録です。多少の差が出ることは自然で、それだけで異常を示すものではありません。",
      "条件と方法をできるだけそろえ、複数回ご確認のうえ、傾向としてご覧ください。",
    ],
    keywords: ["ばらつく", "違う", "おかしい", "数値"],
  },
  {
    id: "building-a-personal-baseline",
    title: "その子の目安をつくる",
    body: [
      "ふだんの数日間、同じ時間帯・同じ環境・同じ方法で続けて記録してください。",
      "毎日の状態がわかっていると、いつもと違う傾向に気づきやすくなります。",
    ],
    keywords: ["目安", "記録", "傾向", "習慣"],
  },
  {
    id: "when-to-seek-veterinary-guidance",
    title: "獣医師にご相談いただくとき",
    body: [
      "PCI01 は診断を行うものではなく、獣医師に代わるものでもありません。",
      "元気・食欲・ふるまいに変化があるときや、ご心配なときは、獣医師にご相談ください。",
    ],
    keywords: ["獣医師", "相談", "心配", "体調"],
  },
];

export function petTemperatureSections(market: MarketId): PetTemperatureSection[] {
  return market === "jp" ? PET_TEMPERATURE_JP : PET_TEMPERATURE_US;
}

export const PET_TEMPERATURE_REVIEW_US =
  "Professionally reviewed reference guidance is being prepared. We do not publish numbers here yet — please ask your veterinarian for guidance specific to your pet.";
export const PET_TEMPERATURE_REVIEW_JP =
  "専門家による確認を経た参考情報を準備しています。数値の掲載は行っておりません。個別のご相談は獣医師にお願いいたします。";
