import { describe, expect, it } from "vitest";
import { troubleshootingFlows, troubleshootingPrefill } from "./faqTroubleshooting";

describe("FAQ troubleshooting handoff", () => {
  for (const market of ["us", "jp"] as const) {
    it(`preserves only selected checks for every ${market} symptom`, () => {
      for (const flow of troubleshootingFlows(market)) {
        const result = troubleshootingPrefill(
          market,
          new URLSearchParams({ symptom: flow.id, checked: "0,2,2,999,bad" }),
        );
        expect(result?.topic).toBe(flow.issue);
        expect(result?.steps).toEqual(
          [flow.steps[0], flow.steps[2]].map((step) => step!.title || step!.body),
        );
        expect(result?.details).toContain(flow.title);
        expect(result?.topic).not.toMatch(/warranty|保証/i);
      }
    });
    it(`allows skipping checks and rejects unknown symptoms in ${market}`, () => {
      const result = troubleshootingPrefill(
        market,
        new URLSearchParams({ symptom: "wont-turn-on" }),
      );
      expect(result?.steps).toEqual([]);
      expect(result?.details.length).toBeGreaterThan(10);
      expect(
        troubleshootingPrefill(market, new URLSearchParams({ symptom: "unknown" })),
      ).toBeNull();
    });
  }
});
