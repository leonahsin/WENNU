/**
 * Server actions for PCI01 support-case intake and staff review.
 *
 * Intake is the ONLY way a case can be created. Visitors have no read, update
 * or delete access to cases, attachments, events or storage objects.
 * No email or external support channel is contacted: delivery stays disabled
 * until real channels and the privacy notice are approved.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILES_PER_CASE,
  MAX_FILE_BYTES,
  buildStoragePath,
  generatePublicReference,
  validateUpload,
} from "@/lib/caseIntake";

/** Temporary launch default — internal configuration requiring approval. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MINUTES = 60;

const attachmentSchema = z.object({
  attachmentType: z.enum(["proof_of_purchase", "complete_product", "issue_closeup", "additional"]),
  filename: z.string().min(1).max(200),
  mimeType: z.enum(ALLOWED_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(MAX_FILE_BYTES),
  dataBase64: z.string().min(1),
});

const submitSchema = z.object({
  submissionKey: z.string().regex(/^[a-f0-9]{32}$/),
  market: z.enum(["US", "JP"]),
  locale: z.enum(["en-US", "ja-JP"]),
  supportTopic: z.string().trim().min(1).max(120),
  purchaseChannel: z.string().trim().min(1).max(120),
  orderReference: z.string().trim().max(60).optional(),
  purchaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  setupState: z.enum(["bare", "blue_silicone_cover"]),
  petGuide: z.enum(["dog", "cat", "not_applicable"]),
  optionalProductIdentifier: z.string().trim().max(60).optional(),
  issueTitle: z.string().trim().min(1).max(100),
  issueDescription: z.string().trim().min(1).max(1500),
  issueStartedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  stepsAlreadyTried: z.array(z.string().max(200)).max(20).default([]),
  damagedOrLeakingBattery: z.boolean(),
  customerEmail: z.string().trim().email().max(254),
  privacyConsentVersion: z.string().min(1).max(60),
  attachments: z.array(attachmentSchema).max(MAX_FILES_PER_CASE),
});

export type SubmitCaseInput = z.input<typeof submitSchema>;

export type SubmitCaseResult =
  | { ok: true; publicReference: string; duplicate: boolean }
  | { ok: false; code: "invalid" | "file_rejected" | "rate_limited" | "unavailable" };

function decodeBase64(data: string): Uint8Array {
  const binary = atob(data.includes(",") ? data.slice(data.indexOf(",") + 1) : data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function fingerprint(): Promise<string> {
  let raw = "unknown";
  try {
    const request = getRequest();
    raw =
      request?.headers.get("cf-connecting-ip") ??
      request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request?.headers.get("x-real-ip") ??
      "unknown";
  } catch {
    /* header access unavailable */
  }
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(digest).slice(0, 16), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

function newReference(market: "US" | "JP"): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return generatePublicReference(market, bytes);
}

export const submitSupportCase = createServerFn({ method: "POST" })
  .inputValidator((input: SubmitCaseInput) => input)
  .handler(async ({ data }): Promise<SubmitCaseResult> => {
    const parsed = submitSchema.safeParse(data);
    if (!parsed.success) return { ok: false, code: "invalid" };
    const input = parsed.data;

    // Authoritative server-side file checks (the client checks too, for UX).
    for (const attachment of input.attachments) {
      const rejection = validateUpload({
        name: attachment.filename,
        type: attachment.mimeType,
        size: attachment.sizeBytes,
      });
      if (rejection) return { ok: false, code: "file_rejected" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Retry-safe: the same submission key always resolves to the same case.
    const existing = await supabaseAdmin
      .from("support_cases")
      .select("public_reference")
      .eq("submission_key", input.submissionKey)
      .maybeSingle();
    if (existing.data?.public_reference) {
      return { ok: true, publicReference: existing.data.public_reference, duplicate: true };
    }

    // Basic abuse protection per sender fingerprint.
    const fp = await fingerprint();
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000);
    const throttle = await supabaseAdmin
      .from("case_submission_throttle")
      .select("fingerprint, window_started_at, submission_count")
      .eq("fingerprint", fp)
      .maybeSingle();

    if (throttle.data && new Date(throttle.data.window_started_at) > windowStart) {
      if (throttle.data.submission_count >= RATE_LIMIT_MAX) {
        return { ok: false, code: "rate_limited" };
      }
      await supabaseAdmin
        .from("case_submission_throttle")
        .update({ submission_count: throttle.data.submission_count + 1 })
        .eq("fingerprint", fp);
    } else {
      await supabaseAdmin
        .from("case_submission_throttle")
        .upsert({
          fingerprint: fp,
          window_started_at: new Date().toISOString(),
          submission_count: 1,
        });
    }

    let inserted: { id: string; public_reference: string } | null = null;
    for (let attempt = 0; attempt < 5 && !inserted; attempt += 1) {
      const { data: row, error } = await supabaseAdmin
        .from("support_cases")
        .insert({
          public_reference: newReference(input.market),
          market: input.market,
          locale: input.locale,
          support_topic: input.supportTopic,
          purchase_channel: input.purchaseChannel,
          order_reference: input.orderReference || null,
          purchase_date: input.purchaseDate ?? null,
          product_code: "PCI01",
          setup_state: input.setupState,
          pet_guide: input.petGuide,
          optional_product_identifier: input.optionalProductIdentifier ?? null,
          issue_title: input.issueTitle,
          issue_description: input.issueDescription,
          issue_started_at: input.issueStartedAt ?? null,
          steps_already_tried: input.stepsAlreadyTried,
          damaged_or_leaking_battery: input.damagedOrLeakingBattery,
          customer_email: input.customerEmail,
          privacy_consent_version: input.privacyConsentVersion,
          submission_key: input.submissionKey,
        })
        .select("id, public_reference")
        .single();

      if (row) {
        inserted = row;
        break;
      }
      // 23505 = unique violation: either a reference collision (retry) or a
      // concurrent retry of the same submission key (resolve to that case).
      if (error?.code === "23505") {
        const dup = await supabaseAdmin
          .from("support_cases")
          .select("public_reference")
          .eq("submission_key", input.submissionKey)
          .maybeSingle();
        if (dup.data?.public_reference) {
          return { ok: true, publicReference: dup.data.public_reference, duplicate: true };
        }
        continue;
      }
      console.error("[support-case] insert failed", error?.code);
      return { ok: false, code: "unavailable" };
    }

    if (!inserted) return { ok: false, code: "unavailable" };

    for (const attachment of input.attachments) {
      const unique = crypto.randomUUID().slice(0, 8);
      const path = buildStoragePath(
        inserted.id,
        attachment.attachmentType,
        attachment.filename,
        unique,
      );
      const bytes = decodeBase64(attachment.dataBase64);
      if (bytes.byteLength > MAX_FILE_BYTES) {
        return { ok: false, code: "file_rejected" };
      }
      const upload = await supabaseAdmin.storage
        .from("support-attachments")
        .upload(path, bytes, { contentType: attachment.mimeType, upsert: false });
      if (upload.error) {
        console.error("[support-case] upload failed");
        return { ok: false, code: "unavailable" };
      }
      await supabaseAdmin.from("case_attachments").insert({
        case_id: inserted.id,
        attachment_type: attachment.attachmentType,
        storage_path: path,
        original_filename: attachment.filename.slice(0, 200),
        mime_type: attachment.mimeType,
        size_bytes: attachment.sizeBytes,
      });
    }

    await supabaseAdmin.from("case_events").insert({
      case_id: inserted.id,
      event_type: "case_created",
      new_status: "new",
    });

    // No email is sent: external delivery stays disabled until approval.
    return { ok: true, publicReference: inserted.public_reference, duplicate: false };
  });

/* ---------------------------------------------------------------- staff API */

export interface StaffAccess {
  isStaff: boolean;
  isAdmin: boolean;
}

export const getStaffAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffAccess> => {
    const { data } = await context.supabase
      .from("support_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role);
    return { isStaff: roles.length > 0, isAdmin: roles.includes("admin") };
  });

const listSchema = z.object({
  market: z.enum(["US", "JP"]).optional(),
  status: z
    .enum(["new", "triaged", "awaiting_customer", "in_review", "resolved", "closed"])
    .optional(),
  topic: z.string().max(120).optional(),
  fromDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  toDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  search: z.string().max(80).optional(),
});

export type ListCasesInput = z.infer<typeof listSchema>;

export interface CaseListRow {
  id: string;
  public_reference: string;
  market: "US" | "JP";
  status: string;
  support_topic: string;
  order_reference: string | null;
  created_at: string;
}

export const listSupportCases = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: ListCasesInput) => input)
  .handler(async ({ data, context }): Promise<CaseListRow[]> => {
    const filters = listSchema.parse(data ?? {});
    let query = context.supabase
      .from("support_cases")
      .select("id, public_reference, market, status, support_topic, order_reference, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (filters.market) query = query.eq("market", filters.market);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.topic) query = query.eq("support_topic", filters.topic);
    if (filters.fromDate) query = query.gte("created_at", `${filters.fromDate}T00:00:00Z`);
    if (filters.toDate) query = query.lte("created_at", `${filters.toDate}T23:59:59Z`);
    if (filters.search) {
      const term = filters.search.replace(/[%,()]/g, "").trim();
      if (term) {
        query = query.or(`public_reference.ilike.%${term}%,order_reference.ilike.%${term}%`);
      }
    }

    const { data: rows, error } = await query;
    if (error) throw new Error("Unable to load cases");
    return (rows ?? []) as CaseListRow[];
  });

export interface CaseDetail {
  caseRecord: Record<string, string | number | boolean | string[] | null>;
  attachments: {
    id: string;
    attachment_type: string;
    original_filename: string;
    mime_type: string;
    size_bytes: number;
    signedUrl: string | null;
  }[];
  events: {
    id: string;
    event_type: string;
    previous_status: string | null;
    new_status: string | null;
    internal_note: string | null;
    created_at: string;
  }[];
}

export const getSupportCase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }): Promise<CaseDetail> => {
    const id = z.string().uuid().parse(data.id);

    const { data: caseRecord, error } = await context.supabase
      .from("support_cases")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !caseRecord) throw new Error("Case not found");

    const { data: attachmentRows } = await context.supabase
      .from("case_attachments")
      .select("id, attachment_type, storage_path, original_filename, mime_type, size_bytes")
      .eq("case_id", id);

    const { data: eventRows } = await context.supabase
      .from("case_events")
      .select("id, event_type, previous_status, new_status, internal_note, created_at")
      .eq("case_id", id)
      .order("created_at", { ascending: false });

    // Short-lived signed URLs. Raw storage paths never leave the server.
    const attachments = await Promise.all(
      (attachmentRows ?? []).map(async (row) => {
        const signed = await context.supabase.storage
          .from("support-attachments")
          .createSignedUrl(row.storage_path, 300);
        return {
          id: row.id,
          attachment_type: row.attachment_type,
          original_filename: row.original_filename,
          mime_type: row.mime_type,
          size_bytes: row.size_bytes,
          signedUrl: signed.data?.signedUrl ?? null,
        };
      }),
    );

    // submission_key is an internal idempotency token and never leaves the server.
    const { submission_key: _omit, ...safeCase } = caseRecord;

    return {
      caseRecord: safeCase as Record<string, string | number | boolean | string[] | null>,
      attachments,
      events: eventRows ?? [],
    };
  });

export const updateSupportCaseStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string; internalNote?: string }) => input)
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    const parsed = z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "triaged", "awaiting_customer", "in_review", "resolved", "closed"]),
        internalNote: z.string().trim().max(1000).optional(),
      })
      .parse(data);

    const { data: current, error: readError } = await context.supabase
      .from("support_cases")
      .select("status")
      .eq("id", parsed.id)
      .single();
    if (readError || !current) throw new Error("Case not found");

    // RLS restricts this update to admins; support staff get a denial.
    const { error: updateError } = await context.supabase
      .from("support_cases")
      .update({ status: parsed.status })
      .eq("id", parsed.id)
      .select("id")
      .single();
    if (updateError) throw new Error("Not permitted");

    await context.supabase.from("case_events").insert({
      case_id: parsed.id,
      event_type: "status_changed",
      previous_status: current.status,
      new_status: parsed.status,
      internal_note: parsed.internalNote ?? null,
      actor_user_id: context.userId,
    });

    return { ok: true };
  });
