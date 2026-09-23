import { describe, expect, it, vi } from "vitest";
import { requestAttempt, validateBriefRequest } from "./briefRequest";
import type { BriefRequest } from "./briefRequest";
const valid: BriefRequest = {
  topic: "Power and battery",
  order: "",
  date: "",
  details: "The screen will not turn on.",
  email: "owner@example.com",
  privacy: true,
};

describe("support request validation", () => {
  it("allows non-warranty requests without purchase information", () => {
    expect(validateBriefRequest(valid, false)).toEqual({});
  });
  it("returns every field error together and retains input", () => {
    const empty = { topic: "", order: "", date: "", details: "", email: "", privacy: false };
    const original = { ...empty };
    expect(Object.keys(validateBriefRequest(empty, true))).toEqual([
      "topic",
      "order",
      "date",
      "details",
      "email",
      "privacy",
    ]);
    expect(empty).toEqual(original);
  });
  it("requires real dates and bounded text for warranty requests", () => {
    expect(
      validateBriefRequest({ ...valid, order: "123-4567890-1234567", date: "2026-02-30" }, true),
    ).toEqual({ date: "date" });
    expect(
      validateBriefRequest({ ...valid, order: "123-4567890-1234567", date: "2024-02-29" }, true),
    ).toEqual({});
    expect(
      validateBriefRequest({ ...valid, details: "x".repeat(1501), email: "broken@" }, false),
    ).toEqual({ details: "details", email: "email" });
  });
  it("accepts Japanese descriptions", () => {
    expect(
      validateBriefRequest(
        { ...valid, topic: "電源・電池", details: "新しい電池を入れても電源が入りません。" },
        false,
      ),
    ).toEqual({});
  });
});
describe("retry after a lost submission response", () => {
  it("reuses the same key until the submitted payload changes", () => {
    const generate = vi.fn().mockReturnValueOnce("first").mockReturnValueOnce("second");
    const first = requestAttempt(null, JSON.stringify(valid), generate);
    expect(requestAttempt(first, JSON.stringify(valid), generate)).toBe(first);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(
      requestAttempt(first, JSON.stringify({ ...valid, email: "updated@example.com" }), generate)
        .key,
    ).toBe("second");
  });
});
