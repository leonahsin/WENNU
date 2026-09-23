import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { readContactContext } from "@/lib/contactContext";
import { patchSupportState } from "@/lib/supportSession";
import { ISSUE_TOPICS } from "@/content/supportRequest";
import { JP_ISSUE_TOPICS } from "@/content/jp/supportRequest";

/** Minimal sessionStorage so the browser-only session module is exercisable. */
const store = new Map<string, string>();
const memoryStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
};

beforeAll(() => {
  (globalThis as { window?: unknown }).window = { sessionStorage: memoryStorage };
});

beforeEach(() => {
  store.clear();
});

describe("contact context handoff", () => {
  it("carries only non-personal context", () => {
    patchSupportState({
      issueCategory: "Product & Care",
      contextLabel: "Which batteries does PCI01 use?",
      searchQuery: "battery",
    });
    const context = readContactContext("us", ISSUE_TOPICS);
    expect(context.topic).toBe("Silicone cover and cleaning");
    expect(context.label).toBe("Which batteries does PCI01 use?");
    expect(context.searchQuery).toBe("battery");
    expect(Object.keys(context).sort()).toEqual([
      "entrySource",
      "label",
      "searchQuery",
      "topic",
    ]);
  });

  it("maps Japanese categories onto existing Japanese topics", () => {
    patchSupportState({ issueCategory: "困ったとき", contextLabel: "電源が入りません" });
    expect(readContactContext("jp", JP_ISSUE_TOPICS).topic).toBe("電源・電池");
  });

  it("returns no topic when nothing was carried", () => {
    expect(readContactContext("us", ISSUE_TOPICS).topic).toBeNull();
    expect(readContactContext("us", ISSUE_TOPICS).entrySource).toBe("general");
  });

  it("never maps to a topic the form does not offer", () => {
    patchSupportState({ issueCategory: "Getting Started" });
    expect(readContactContext("us", ["Something else"]).topic).toBeNull();
  });
});
