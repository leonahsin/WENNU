/**
 * Client-side search normalization used by the FAQ (and any other local search).
 *
 * Design rules (regression guard):
 * - Documents are indexed ONLY by their own tokens and stems. Synonym groups
 *   never inject words into a document's keys.
 * - Synonyms expand the QUERY side only, so an alias can widen what the user
 *   typed but can never make unrelated items match.
 */

/**
 * Approved query aliases, keyed by stemmed term. Typing any listed term also
 * accepts its aliases. Kept deliberately tight — no generic words.
 */
const QUERY_ALIASES: Record<string, string[]> = {
  battery: ["batteries"],
  scan: ["scanning"],
  record: ["records", "reading", "readings"],
  reading: ["readings", "record", "records"],
  cover: ["silicone"],
  wash: ["washing", "clean", "cleaning"],
  clean: ["cleaning", "wash", "washing"],
  dog: ["cat", "pet"],
  cat: ["dog", "pet"],
  pet: ["dog", "cat"],
  temperature: ["high"],
};

function stem(token: string): string {
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && (token.endsWith("ses") || token.endsWith("hes") || token.endsWith("xes")))
    return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  return token;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Build the searchable key set for a document made of several text fields.
 * Contains only the document's own tokens and their stems — nothing else.
 */
export function buildSearchKeys(fields: (string | string[] | undefined)[]): Set<string> {
  const keys = new Set<string>();
  for (const field of fields) {
    if (!field) continue;
    const text = Array.isArray(field) ? field.join(" ") : field;
    for (const token of tokenize(text)) {
      keys.add(token);
      keys.add(stem(token));
    }
  }
  return keys;
}

/** Query-side variants for one typed token: itself, its stem, approved aliases. */
function queryVariants(token: string): string[] {
  const stemmed = stem(token);
  const variants = new Set([token, stemmed]);
  for (const alias of QUERY_ALIASES[token] ?? []) {
    variants.add(alias);
    variants.add(stem(alias));
  }
  if (stemmed !== token) {
    for (const alias of QUERY_ALIASES[stemmed] ?? []) {
      variants.add(alias);
      variants.add(stem(alias));
    }
  }
  return [...variants];
}

/**
 * True when every query token matches the document: by exact key, stem,
 * approved query alias, or (for longer tokens) a prefix of a document key.
 */
export function matchesSearch(query: string, keys: Set<string>): boolean {
  const tokens = tokenize(query);
  if (tokens.length === 0) return true;
  const all = [...keys];
  return tokens.every((token) => {
    if (queryVariants(token).some((v) => keys.has(v))) return true;
    if (token.length < 3) return false;
    return all.some((k) => k.length >= 3 && k.startsWith(token));
  });
}
