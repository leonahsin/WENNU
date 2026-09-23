import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  homeDestination,
  patchSupportState,
  readSupportState,
} from "@/lib/supportSession";
import { readContactContext } from "@/lib/contactContext";
import { ISSUE_TOPICS } from "@/content/supportRequest";
import { JP_ISSUE_TOPICS } from "@/content/jp/supportRequest";
import { FAQ_ITEMS } from "@/content/support";
import { JP_FAQ_ITEMS } from "@/content/jp/support";

/** Minimal sessionStorage so the browser-only session module is exercisable. */
const store = new Map<string, string>();
beforeAll(() => {
  (globalThis as { window?: unknown }).window = {
    sessionStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
    },
  };
});
beforeEach(() => store.clear());

describe("QR entry state", () => {
  it("keeps QR visitors on the PCI01 support home in both locales", () => {
    expect(homeDestination("en-US", "qr")).toBe("/product/pci01");
    expect(homeDestination("ja-JP", "qr")).toBe("/jp/product/pci01");
  });

  it("sends general visitors back to product selection", () => {
    expect(homeDestination("en-US", "general")).toBe("/");
    expect(homeDestination("ja-JP", "general")).toBe("/jp");
  });

  it("persists the QR entry source across navigation", () => {
    patchSupportState({ entrySource: "qr", product: "PCI01" });
    patchSupportState({ searchQuery: "battery" });
    expect(readSupportState().entrySource).toBe("qr");
  });
});

describe("search state preservation", () => {
  it("restores the query after leaving and returning", () => {
    patchSupportState({ searchQuery: "temperature wrong" });
    expect(readSupportState().searchQuery).toBe("temperature wrong");
    // An unrelated patch (e.g. opening a result) must not clear it.
    patchSupportState({ lastInstructional: "/faq#faq-how-to-observe" });
    expect(readSupportState().searchQuery).toBe("temperature wrong");
  });

  it("uses a URL-safe query that native Back can restore", () => {
    const query = "temperature wrong";
    const url = `/product/pci01?q=${encodeURIComponent(query)}`;
    expect(new URL(url, "https://support.test").searchParams.get("q")).toBe(query);
    const result = `/faq?returnTo=${encodeURIComponent(url)}#faq-how-to-observe`;
    expect(new URL(result, "https://support.test").searchParams.get("returnTo")).toBe(url);
  });
});

describe("FAQ deep links", () => {
  it("every faq-<id> anchor resolves to an existing question", () => {
    for (const item of FAQ_ITEMS) {
      const id = `faq-${item.id}`;
      const parsed = /^faq-(.+)$/.exec(id)?.[1];
      expect(FAQ_ITEMS.some((f) => f.id === parsed)).toBe(true);
    }
    for (const item of JP_FAQ_ITEMS) {
      expect(JP_FAQ_ITEMS.some((f) => f.id === item.id)).toBe(true);
    }
  });
});

describe("contact handoff context", () => {
  it("carries the FAQ question and preselects a compatible topic (U.S.)", () => {
    const item = FAQ_ITEMS[0]!;
    patchSupportState({ contextLabel: item.question, issueCategory: item.category });
    const context = readContactContext("us", ISSUE_TOPICS);
    expect(context.label).toBe(item.question);
    expect(context.topic === null || ISSUE_TOPICS.includes(context.topic)).toBe(true);
  });

  it("carries the FAQ question and preselects a compatible topic (Japan)", () => {
    const item = JP_FAQ_ITEMS[0]!;
    patchSupportState({ contextLabel: item.question, issueCategory: item.category });
    const context = readContactContext("jp", JP_ISSUE_TOPICS);
    expect(context.label).toBe(item.question);
    expect(context.topic === null || JP_ISSUE_TOPICS.includes(context.topic)).toBe(true);
  });

  it("never carries personal data keys", () => {
    patchSupportState({ contextLabel: "Q", issueCategory: "Troubleshooting" });
    expect(Object.keys(readContactContext("us", ISSUE_TOPICS)).sort()).toEqual([
      "entrySource",
      "label",
      "searchQuery",
      "topic",
    ]);
  });
});
