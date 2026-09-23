/**
 * Shared, browser-safe rules for PCI01 support-case intake.
 *
 * The upload allow-list, size cap and retention duration are TEMPORARY LAUNCH
 * DEFAULTS. They are internal configuration and must be approved before launch;
 * nothing here should be presented to customers as final policy.
 */

/** Temporary launch default — internal configuration requiring approval. */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

/** Temporary launch default — internal configuration requiring approval. */
export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf"] as const;

/** Temporary launch default — internal configuration requiring approval. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Maximum number of files accepted with a single case. */
export const MAX_FILES_PER_CASE = 4;

/**
 * Version string stored with each case so we know which notice the customer saw.
 * The notice itself is a DRAFT awaiting approval.
 */
export const PRIVACY_CONSENT_VERSION = "draft-unapproved-v1";

/**
 * Retention duration is an approval-required configuration value.
 * It is deliberately null: no retention period may be invented or displayed.
 */
export const RETENTION_DURATION: null = null;

export type AttachmentType =
  | "proof_of_purchase"
  | "complete_product"
  | "issue_closeup"
  | "additional";

export type CaseStatus =
  | "new"
  | "triaged"
  | "awaiting_customer"
  | "in_review"
  | "resolved"
  | "closed";

export const CASE_STATUSES: CaseStatus[] = [
  "new",
  "triaged",
  "awaiting_customer",
  "in_review",
  "resolved",
  "closed",
];

export type FileRejection = "type" | "size" | "empty";

export interface FileLike {
  name: string;
  type: string;
  size: number;
}

function extensionOf(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : "";
}

/**
 * Validate a candidate upload. Used on the client for immediate feedback and
 * again on the server, which is the authoritative check.
 */
export function validateUpload(file: FileLike): FileRejection | null {
  if (!file.size) return "empty";
  if (file.size > MAX_FILE_BYTES) return "size";
  const typeOk = (ALLOWED_MIME_TYPES as readonly string[]).includes(file.type);
  const extOk = (ALLOWED_EXTENSIONS as readonly string[]).includes(extensionOf(file.name));
  if (!typeOk || !extOk) return "type";
  return null;
}

/**
 * Strip directory components and anything that is not a conservative filename
 * character. Never trust the browser-supplied name for a storage path.
 */
export function sanitizeFilename(filename: string): string {
  const base = (filename.split(/[\\/]/).pop() ?? "").normalize("NFKD");
  const cleaned = base
    .replace(/[^\p{Letter}\p{Number}._-]+/gu, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[.-]+/, "")
    .slice(0, 80);
  return cleaned || "upload";
}

const REFERENCE_ALPHABET = "ACDEFGHJKLMNPQRTUVWXY34679";

/**
 * Non-sequential, human-readable public reference. Generated server-side only.
 * Carries no ordering information and is not derived from the case id.
 */
export function generatePublicReference(
  market: "US" | "JP",
  randomBytes: Uint8Array,
): string {
  let out = "";
  for (const byte of randomBytes) {
    out += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  }
  const body = out.slice(0, 10).padEnd(10, REFERENCE_ALPHABET[0]!);
  return `${market}-${body.slice(0, 5)}-${body.slice(5, 10)}`;
}

/** Server-generated storage path. Never derived from user input alone. */
export function buildStoragePath(
  caseId: string,
  attachmentType: AttachmentType,
  filename: string,
  unique: string,
): string {
  return `cases/${caseId}/${attachmentType}/${unique}-${sanitizeFilename(filename)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 254 && EMAIL_RE.test(trimmed);
}

/** Map the U.S./JP form cover-state ids to the stored setup_state enum. */
export function toSetupState(coverState: string): "bare" | "blue_silicone_cover" {
  return coverState === "with-cover" ? "blue_silicone_cover" : "bare";
}

/** Map the usage-guide selection to the stored pet_guide enum. */
export function toPetGuide(guide: string): "dog" | "cat" | "not_applicable" {
  return guide === "dog" ? "dog" : guide === "cat" ? "cat" : "not_applicable";
}

/** A stable submission key makes retries idempotent instead of duplicating cases. */
export function makeSubmissionKey(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
