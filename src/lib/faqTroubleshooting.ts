import type { MarketId } from "@/content/market";
import { TROUBLESHOOTING_CATEGORIES, WONT_TURN_ON_STEPS } from "@/content/support";
import { JP_TROUBLESHOOTING_CATEGORIES, JP_WONT_TURN_ON_STEPS } from "@/content/jp/support";

export function troubleshootingFlows(market: MarketId) {
  const jp = market === "jp";
  const categories = jp ? JP_TROUBLESHOOTING_CATEGORIES : TROUBLESHOOTING_CATEGORIES;
  const power = jp ? JP_WONT_TURN_ON_STEPS : WONT_TURN_ON_STEPS;
  const issues: Record<string, string> = jp
    ? {
        "wont-turn-on": "電源・電池",
        "screen-backlight": "画面・バックライト",
        "inconsistent-measurements": "測定値のばらつき",
        "silicone-cover": "シリコンカバー・お手入れ",
      }
    : {
        "wont-turn-on": "Power and battery",
        "screen-backlight": "Screen and backlight",
        "inconsistent-measurements": "Measurement consistency",
        "silicone-cover": "Silicone cover and cleaning",
      };
  return categories
    .filter((item) => item.id in issues)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      issue: issues[item.id]!,
      steps:
        item.id === "wont-turn-on"
          ? power.map((step) => ({
              title: step.title,
              body: [step.instruction, step.detail, step.warning].filter(Boolean).join(" "),
            }))
          : (item.steps ?? []).map((body) => ({ title: "", body })),
    }));
}

export function troubleshootingPrefill(market: MarketId, params: URLSearchParams) {
  const flow = troubleshootingFlows(market).find((item) => item.id === params.get("symptom"));
  if (!flow) return null;
  const indices = new Set(
    (params.get("checked") ?? "")
      .split(",")
      .filter((value) => /^\d+$/.test(value))
      .map(Number),
  );
  const steps = flow.steps
    .filter((_, index) => indices.has(index))
    .map((step) => step.title || step.body);
  const jp = market === "jp";
  return {
    topic: flow.issue,
    title: flow.title,
    steps,
    details: [
      flow.title,
      jp ? "確認後も解決していません。" : "The issue is still not resolved.",
      steps.length
        ? jp
          ? "試したこと："
          : "Checks already tried:"
        : jp
          ? "まだ確認項目を選択していません。"
          : "No checks selected yet.",
      ...steps.map((step) => `- ${step}`),
    ].join("\n"),
  };
}
