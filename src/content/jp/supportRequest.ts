import { isValidEmail } from "@/lib/caseIntake";

/**
 * Japanese five-step support request content.
 *
 * The U.S. purchase-channel list, warranty terms, fees, response times and
 * routing rules are NOT reused. Japan-specific operational data is left to the
 * internal draft notice, and the purchase channel is a free-text field until
 * the approved Japanese list is available.
 */

export type JpStepId = "purchase" | "product" | "issue" | "photos" | "review";

export interface JpStepDef {
  id: JpStepId;
  title: string;
  shortTitle: string;
  description: string;
}

export const JP_REQUEST_STEPS: JpStepDef[] = [
  {
    id: "purchase",
    title: "ご購入情報",
    shortTitle: "購入",
    description: "PCI01 をご購入いただいた時期と、購入を確認できる書類についてご記入ください。",
  },
  {
    id: "product",
    title: "製品情報",
    shortTitle: "製品",
    description: "対象製品は PCI01 ペット用体温計です。ご使用状況をお知らせください。",
  },
  {
    id: "issue",
    title: "症状の詳細",
    shortTitle: "症状",
    description: "現在の症状、発生時期、すでにお試しいただいた内容をご記入ください。",
  },
  {
    id: "photos",
    title: "写真",
    shortTitle: "写真",
    description: "状態がわかる写真をご用意いただくと、確認がスムーズになります。",
  },
  {
    id: "review",
    title: "内容の確認",
    shortTitle: "確認",
    description: "各項目をご確認のうえ、取り扱いに関するご案内にご同意ください。",
  },
];

export const JP_ISSUE_TOPICS = [
  "初期設定・はじめての使用",
  "電源・電池",
  "画面・バックライト",
  "測定値のばらつき",
  "シリコンカバー・お手入れ",
  "保存された測定値",
  "保証・返品に関するご相談",
  "その他",
];

export const JP_STEPS_TRIED = [
  "単4形1.5V乾電池2本が入っているか確認した",
  "電池の向きを確認した",
  "裏ぶたを開ける前にシリコンカバーを外した",
  "新しい同じ種類の電池に交換した",
  "「電源が入らない」5ステップの手順を最後まで実施した",
  "途中で離さず続けて測定した",
  "複数回測定して数値を見比べた",
  "シリコン製の測定先端とコームの歯を洗った",
];

export interface JpRequestFormData {
  purchaseChannel: string;
  orderNumber: string;
  purchaseDate: string;
  proofFileName: string;
  coverState: string;
  guide: string;
  identifier: string;
  issueTopic: string;
  issueTitle: string;
  issueDescription: string;
  issueStartDate: string;
  stepsTried: string[];
  batterySafety: string;
  photoComplete: string;
  photoCloseUp: string;
  photoOptional: string;
  customerEmail: string;
  privacyAcknowledged: boolean;
}

export const JP_EMPTY_FORM: JpRequestFormData = {
  purchaseChannel: "",
  orderNumber: "",
  purchaseDate: "",
  proofFileName: "",
  coverState: "",
  guide: "",
  identifier: "",
  issueTopic: "",
  issueTitle: "",
  issueDescription: "",
  issueStartDate: "",
  stepsTried: [],
  batterySafety: "",
  photoComplete: "",
  photoCloseUp: "",
  photoOptional: "",
  customerEmail: "",
  privacyAcknowledged: false,
};

/** Separate key so U.S. and Japan drafts never overwrite each other. */
export const JP_STORAGE_KEY = "pci01-support-request-jp-v1";

export function validateJpStep(
  step: JpStepId,
  data: JpRequestFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === "purchase") {
    if (!data.purchaseChannel.trim())
      errors["purchaseChannel"] = "ご購入元をご記入ください。";
    else if (data.purchaseChannel.trim().length > 60)
      errors["purchaseChannel"] = "ご購入元は60文字以内でご記入ください。";
    if (!data.orderNumber.trim())
      errors["orderNumber"] = "注文番号またはレシート番号をご記入ください。";
    else if (data.orderNumber.trim().length > 60)
      errors["orderNumber"] = "注文番号は60文字以内でご記入ください。";
    if (!data.purchaseDate) errors["purchaseDate"] = "ご購入日をご入力ください。";
    if (!data.proofFileName)
      errors["proofFileName"] = "購入を確認できる書類のファイルを添付してください。";
  }
  if (step === "product") {
    if (!data.coverState)
      errors["coverState"] = "シリコンカバーの装着状態をお選びください。";
    if (!data.guide) errors["guide"] = "犬用ガイドまたは猫用ガイドをお選びください。";
    if (data.identifier.length > 60)
      errors["identifier"] = "識別番号は60文字以内でご記入ください。";
  }
  if (step === "issue") {
    if (!data.issueTopic) errors["issueTopic"] = "ご相談の種類をお選びください。";
    if (!data.issueTitle.trim()) errors["issueTitle"] = "症状の件名をご記入ください。";
    else if (data.issueTitle.trim().length > 100)
      errors["issueTitle"] = "件名は100文字以内でご記入ください。";
    if (data.issueDescription.trim().length < 10)
      errors["issueDescription"] = "症状の詳細を10文字以上でご記入ください。";
    else if (data.issueDescription.trim().length > 1500)
      errors["issueDescription"] = "詳細は1500文字以内でご記入ください。";
    if (!data.issueStartDate) errors["issueStartDate"] = "発生時期をご入力ください。";
    if (!data.batterySafety)
      errors["batterySafety"] = "電池の破損・液もれに関する安全確認にお答えください。";
  }
  if (step === "photos") {
    if (!data.photoComplete) errors["photoComplete"] = "製品全体の写真を追加してください。";
    if (!data.photoCloseUp) errors["photoCloseUp"] = "症状がわかる接写の写真を追加してください。";
  }
  if (step === "review") {
    if (!data.customerEmail.trim())
      errors["customerEmail"] = "ご連絡先のメールアドレスをご入力ください。";
    else if (!isValidEmail(data.customerEmail))
      errors["customerEmail"] = "メールアドレスの形式をご確認ください。";
    if (!data.privacyAcknowledged)
      errors["privacyAcknowledged"] = "取り扱いに関するご案内にご同意ください。";
  }
  return errors;
}
