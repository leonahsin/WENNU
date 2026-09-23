/**
 * Client-side search for the Japanese market.
 *
 * Japanese text has no word spacing, so tokenizing on whitespace does not work.
 * Documents are indexed as one normalized haystack string and every query chunk
 * must appear in it (AND semantics). Approved aliases expand the QUERY side
 * only, so an alias can widen what the user typed but can never make unrelated
 * items match.
 */

/** Approved Japanese query aliases. Deliberately tight — no generic words. */
const JA_QUERY_ALIASES: Record<string, string[]> = {
  電池: ["バッテリー", "乾電池", "単4"],
  バッテリー: ["電池", "乾電池"],
  乾電池: ["電池"],
  測定: ["スキャン", "計測"],
  スキャン: ["測定"],
  記録: ["履歴", "保存", "30件"],
  履歴: ["記録", "保存"],
  カバー: ["シリコン"],
  シリコン: ["カバー"],
  洗う: ["洗浄", "水洗い"],
  洗浄: ["洗う"],
  掃除: ["洗浄", "洗う"],
  犬: ["いぬ", "ガイド"],
  猫: ["ねこ", "ガイド"],
};

/** Normalize width, case and spacing so 「電池」「ﾃﾞﾝﾁ」「Battery」 compare cleanly. */
export function normalizeJa(text: string): string {
  return text.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

/** Build one searchable haystack from a document's own fields. */
export function buildJaHaystack(fields: (string | string[] | undefined)[]): string {
  return fields
    .filter(Boolean)
    .map((field) => (Array.isArray(field) ? field!.join(" ") : field!))
    .map(normalizeJa)
    .join("\u0000");
}

/** Split a query into chunks on spaces and common punctuation. */
export function splitJaQuery(query: string): string[] {
  return query
    .normalize("NFKC")
    .split(/[\s、,。・/]+/)
    .map((chunk) => chunk.trim().toLowerCase())
    .filter(Boolean);
}

function jaVariants(chunk: string): string[] {
  const variants = new Set([chunk]);
  for (const alias of JA_QUERY_ALIASES[chunk] ?? []) variants.add(normalizeJa(alias));
  return [...variants];
}

/** True when every query chunk (or one of its approved aliases) is present. */
export function matchesJaSearch(query: string, haystack: string): boolean {
  const chunks = splitJaQuery(query);
  if (chunks.length === 0) return true;
  return chunks.every((chunk) =>
    jaVariants(normalizeJa(chunk)).some((variant) => haystack.includes(variant)),
  );
}
