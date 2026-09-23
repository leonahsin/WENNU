import { describe, expect, it } from "vitest";
import { mergeRestoredDraft } from "./useDraftForm";
import { EMPTY_FORM, validateStep, type RequestFormData } from "@/content/supportRequest";
import { JP_EMPTY_FORM, validateJpStep } from "@/content/jp/supportRequest";

const step1 = (over: Partial<RequestFormData> = {}): RequestFormData => ({
  ...EMPTY_FORM,
  purchaseChannel: "Online marketplace",
  orderNumber: "A-1001",
  proofFileName: "receipt.jpg",
  ...over,
});

describe("purchase date state stays canonical", () => {
  it("fresh form: setting the date satisfies step 1", () => {
    const before = step1();
    expect(validateStep("purchase", before)).toHaveProperty("purchaseDate");
    const after = { ...before, purchaseDate: "2026-08-31" };
    expect(validateStep("purchase", after)).toEqual({});
    expect(after.proofFileName).toBe("receipt.jpg");
  });

  it("a late draft restore never overwrites an edited date", () => {
    const saved: Partial<RequestFormData> = { ...step1(), purchaseDate: "" };
    const current = { ...EMPTY_FORM, purchaseDate: "2026-08-31" };
    const merged = mergeRestoredDraft(EMPTY_FORM, saved, current, ["purchaseDate"]);
    expect(merged.purchaseDate).toBe("2026-08-31");
    // untouched fields still come from the draft
    expect(merged.orderNumber).toBe("A-1001");
  });

  it("restored draft with a date passes step 1 without re-entry", () => {
    const saved = step1({ purchaseDate: "2026-08-31" });
    const merged = mergeRestoredDraft(EMPTY_FORM, saved, EMPTY_FORM, []);
    expect(validateStep("purchase", merged)).toEqual({});
  });

  it("setting the date after a failed validation clears only that error", () => {
    const failing = validateStep("purchase", step1());
    expect(Object.keys(failing)).toEqual(["purchaseDate"]);
    const fixed = validateStep("purchase", step1({ purchaseDate: "2026-08-31" }));
    expect(fixed["purchaseDate"]).toBeUndefined();
    expect(Object.keys(fixed)).toHaveLength(0);
  });

  it("moving Previous/Next keeps the date and proof file intact", () => {
    let data = step1({ purchaseDate: "2026-08-31" });
    // Next to product step, then Previous back to purchase.
    expect(validateStep("purchase", data)).toEqual({});
    data = mergeRestoredDraft(EMPTY_FORM, data, data, Object.keys(data) as (keyof RequestFormData)[]);
    expect(data.purchaseDate).toBe("2026-08-31");
    expect(data.proofFileName).toBe("receipt.jpg");
    expect(validateStep("purchase", data)).toEqual({});
  });
});

describe("Japan form uses the same canonical pattern", () => {
  it("keeps an edited date through a restore and clears the error", () => {
    const saved = { ...JP_EMPTY_FORM, purchaseChannel: "オンラインストア", orderNumber: "A-1", proofFileName: "r.jpg" };
    const current = { ...JP_EMPTY_FORM, purchaseDate: "2026-08-31" };
    const merged = mergeRestoredDraft(JP_EMPTY_FORM, saved, current, ["purchaseDate"]);
    expect(merged.purchaseDate).toBe("2026-08-31");
    expect(validateJpStep("purchase", merged)).toEqual({});
  });
});
