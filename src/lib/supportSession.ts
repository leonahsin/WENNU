/**
 * Non-personal support session state.
 *
 * Stored in sessionStorage only. It never contains personal data — just the
 * product the visitor is looking at, how they arrived (general browse or QR),
 * their locale, and lightweight UI state used to restore where they were.
 */

export type EntrySource = "general" | "qr";
export type SupportLocale = "en-US" | "ja-JP";

export interface SupportSessionState {
  product: string | null;
  entrySource: EntrySource;
  locale: SupportLocale;
  searchQuery: string;
  faqCategory: string | null;
  faqOpenId: string | null;
  /** Most recently viewed instructional content (route + anchor). */
  lastInstructional: string | null;
  /** Scroll offsets keyed by a stable page key. */
  scroll: Record<string, number>;
  /** Issue context carried into Contact Support. Never personal data. */
  issueCategory: string | null;
  contextLabel: string | null;
}

const KEY = "pci01-support-state";

const DEFAULT_STATE: SupportSessionState = {
  product: null,
  entrySource: "general",
  locale: "en-US",
  searchQuery: "",
  faqCategory: null,
  faqOpenId: null,
  lastInstructional: null,
  scroll: {},
  issueCategory: null,
  contextLabel: null,
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function readSupportState(): SupportSessionState {
  if (!isBrowser()) return { ...DEFAULT_STATE };
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<SupportSessionState>;
    return { ...DEFAULT_STATE, ...parsed, scroll: { ...DEFAULT_STATE.scroll, ...parsed.scroll } };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function patchSupportState(patch: Partial<SupportSessionState>): SupportSessionState {
  const next = { ...readSupportState(), ...patch };
  if (!isBrowser()) return next;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — state simply is not preserved */
  }
  return next;
}

export function rememberScroll(key: string, offset: number): void {
  const current = readSupportState();
  patchSupportState({ scroll: { ...current.scroll, [key]: Math.max(0, Math.round(offset)) } });
}

export function recallScroll(key: string): number {
  return readSupportState().scroll[key] ?? 0;
}

/** Home destination that respects the entry source. QR users never go back to product selection. */
export function homeDestination(locale: SupportLocale, entrySource: EntrySource): string {
  const jp = locale === "ja-JP";
  if (entrySource === "qr") return jp ? "/jp/product/pci01" : "/product/pci01";
  return jp ? "/jp" : "/";
}
