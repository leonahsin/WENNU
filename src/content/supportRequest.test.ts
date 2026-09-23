import { describe, expect, it } from "vitest";
import { EMPTY_FORM, validateStep, type RequestFormData } from "./supportRequest";
import {
  JP_EMPTY_FORM,
  validateJpStep,
  type JpRequestFormData,
} from "./jp/supportRequest";

const usComplete: RequestFormData = {
  ...EMPTY_FORM,
  purchaseChannel: "Online marketplace",
  orderNumber: "A-1001",
  purchaseDate: "2026-01-05",
  proofFileName: "receipt.pdf",
  coverState: "with-cover",
  guide: "dog",
  issueTopic: "Power and battery issues",
  issueTitle: "Screen stays dark",
  issueDescription: "The display stays dark after fitting fresh batteries and pressing the button.",
  issueStartDate: "2026-01-20",
  batterySafety: "No",
  photoComplete: "front.jpg",
  photoCloseUp: "closeup.jpg",
  customerEmail: "owner@example.com",
  privacyAcknowledged: true,
};

describe("U.S. step validation", () => {
  it("blocks every step while required fields are empty", () => {
    for (const step of ["purchase", "product", "issue", "photos", "review"] as const) {
      expect(Object.keys(validateStep(step, EMPTY_FORM)).length).toBeGreaterThan(0);
    }
  });

  it("passes every step once the form is complete", () => {
    for (const step of ["purchase", "product", "issue", "photos", "review"] as const) {
      expect(validateStep(step, usComplete)).toEqual({});
    }
  });

  it("requires a valid reply email and the privacy acknowledgement", () => {
    expect(validateStep("review", { ...usComplete, customerEmail: "" })).toHaveProperty(
      "customerEmail",
    );
    expect(validateStep("review", { ...usComplete, customerEmail: "not-an-email" })).toHaveProperty(
      "customerEmail",
    );
    expect(
      validateStep("review", { ...usComplete, privacyAcknowledged: false }),
    ).toHaveProperty("privacyAcknowledged");
  });
});

const jpComplete: JpRequestFormData = {
  ...JP_EMPTY_FORM,
  purchaseChannel: "オンラインストア",
  orderNumber: "A-1001",
  purchaseDate: "2026-01-05",
  proofFileName: "receipt.pdf",
  coverState: "with-cover",
  guide: "dog",
  issueTopic: JP_EMPTY_FORM.issueTopic,
  issueTitle: "画面がつきません",
  issueDescription:
    "新しい電池を入れてボタンを押しても画面が表示されない状態が続いています。設置場所を変えても同じです。",
  issueStartDate: "2026-01-20",
  batterySafety: "いいえ",
  photoComplete: "front.jpg",
  photoCloseUp: "closeup.jpg",
  customerEmail: "owner@example.jp",
  privacyAcknowledged: true,
};

describe("Japanese step validation", () => {
  it("blocks every step while required fields are empty", () => {
    for (const step of ["purchase", "product", "issue", "photos", "review"] as const) {
      expect(Object.keys(validateJpStep(step, JP_EMPTY_FORM)).length).toBeGreaterThan(0);
    }
  });

  it("requires a valid reply email before submission", () => {
    expect(validateJpStep("review", { ...jpComplete, customerEmail: "" })).toHaveProperty(
      "customerEmail",
    );
    expect(
      validateJpStep("review", { ...jpComplete, customerEmail: "owner@example" }),
    ).toHaveProperty("customerEmail");
  });
});
