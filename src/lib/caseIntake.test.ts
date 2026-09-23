import { describe, expect, it } from "vitest";
import {
  MAX_FILE_BYTES,
  buildStoragePath,
  generatePublicReference,
  isValidEmail,
  makeSubmissionKey,
  sanitizeFilename,
  toPetGuide,
  toSetupState,
  validateUpload,
} from "./caseIntake";

const file = (name: string, type: string, size: number) => ({ name, type, size });

describe("validateUpload", () => {
  it("accepts the approved image and document types", () => {
    expect(validateUpload(file("receipt.pdf", "application/pdf", 1024))).toBeNull();
    expect(validateUpload(file("photo.JPG", "image/jpeg", 2048))).toBeNull();
    expect(validateUpload(file("photo.webp", "image/webp", 2048))).toBeNull();
  });

  it("rejects unsupported types even when the extension looks fine", () => {
    expect(validateUpload(file("payload.exe", "application/x-msdownload", 10))).toBe("type");
    expect(validateUpload(file("photo.png", "text/html", 10))).toBe("type");
    expect(validateUpload(file("script.svg", "image/svg+xml", 10))).toBe("type");
  });

  it("rejects empty and oversized files", () => {
    expect(validateUpload(file("photo.png", "image/png", 0))).toBe("empty");
    expect(validateUpload(file("photo.png", "image/png", MAX_FILE_BYTES + 1))).toBe("size");
    expect(validateUpload(file("photo.png", "image/png", MAX_FILE_BYTES))).toBeNull();
  });
});

describe("sanitizeFilename", () => {
  it("strips directories and traversal segments", () => {
    expect(sanitizeFilename("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFilename("C:\\Users\\me\\photo.png")).toBe("photo.png");
  });

  it("never yields an empty name", () => {
    expect(sanitizeFilename("...")).toBe("upload");
  });
});

describe("buildStoragePath", () => {
  it("keeps user input inside a server-controlled prefix", () => {
    const path = buildStoragePath("abc-123", "issue_closeup", "../../secret.png", "u1");
    expect(path).toBe("cases/abc-123/issue_closeup/u1-secret.png");
    expect(path.includes("..")).toBe(false);
  });
});

describe("generatePublicReference", () => {
  it("produces a market-prefixed reference with no ambiguous characters", () => {
    const reference = generatePublicReference("US", new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
    expect(reference).toMatch(/^US-[ACDEFGHJKLMNPQRTUVWXY34679]{5}-[ACDEFGHJKLMNPQRTUVWXY34679]{5}$/);
    // Ambiguous glyphs must not appear in the body customers read back to us.
    expect(reference.slice(3)).not.toMatch(/[OI01SB2]/);
  });

  it("uses the JP prefix for the Japanese market", () => {
    expect(generatePublicReference("JP", new Uint8Array(10)).startsWith("JP-")).toBe(true);
  });
});

describe("submission keys", () => {
  it("creates distinct 32-character hex keys for idempotent retries", () => {
    const a = makeSubmissionKey();
    const b = makeSubmissionKey();
    expect(a).toMatch(/^[a-f0-9]{32}$/);
    expect(a).not.toBe(b);
  });
});

describe("form value mapping", () => {
  it("maps cover state and guide selections to stored enums", () => {
    expect(toSetupState("with-cover")).toBe("blue_silicone_cover");
    expect(toSetupState("without-cover")).toBe("bare");
    expect(toPetGuide("dog")).toBe("dog");
    expect(toPetGuide("cat")).toBe("cat");
    expect(toPetGuide("")).toBe("not_applicable");
  });
});

describe("isValidEmail", () => {
  it("accepts ordinary addresses and rejects malformed ones", () => {
    expect(isValidEmail("owner@example.com")).toBe(true);
    expect(isValidEmail(" owner@example.co.jp ")).toBe(true);
    expect(isValidEmail("owner@example")).toBe(false);
    expect(isValidEmail("owner example.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});
