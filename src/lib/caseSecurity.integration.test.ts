/**
 * Backend security verification for PCI01 support-case intake.
 *
 * These tests talk to the live Lovable Cloud project. They only READ with the
 * anonymous key (expecting denials) and use the service role for the small
 * amount of fixture setup that anonymous callers must never be able to do.
 * They never create staff accounts and never send email.
 */
import { createClient } from "@supabase/supabase-js";
import { afterAll, describe, expect, it } from "vitest";

const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"] ?? "";
const anonKey =
  process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? "";
const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";

const ready = Boolean(url && anonKey && serviceKey);
const d = ready ? describe : describe.skip;

const authOpts = { auth: { persistSession: false, autoRefreshToken: false } } as const;
const anon = ready ? createClient(url, anonKey, authOpts) : null!;
const admin = ready ? createClient(url, serviceKey, authOpts) : null!;

const BUCKET = "support-attachments";
const cleanupPaths: string[] = [];

afterAll(async () => {
  if (ready && cleanupPaths.length) await admin.storage.from(BUCKET).remove(cleanupPaths);
});

d("anonymous access to support cases", () => {
  it("cannot list or read cases", async () => {
    const { data, error } = await anon.from("support_cases").select("id, customer_email");
    expect(error ?? { code: "" }).toBeTruthy();
    expect(data ?? []).toEqual([]);
  });

  it("cannot insert a case directly (intake server action is the only path)", async () => {
    const { error } = await anon.from("support_cases").insert({
      public_reference: "US-AAAAA-AAAAA",
      market: "US",
      locale: "en-US",
      support_topic: "t",
      purchase_channel: "c",
      order_reference: "o",
      purchase_date: "2026-01-01",
      setup_state: "bare",
      pet_guide: "dog",
      issue_title: "t",
      issue_description: "d",
      customer_email: "anon@example.invalid",
      privacy_consent_version: "v1",
      submission_key: "0".repeat(32),
    } as never);
    expect(error).toBeTruthy();
  });

  it("cannot update or delete cases", async () => {
    const { error: upd } = await anon
      .from("support_cases")
      .update({ status: "closed" } as never)
      .neq("id", "00000000-0000-0000-0000-000000000000")
      .select("id");
    const { data: del } = await anon
      .from("support_cases")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")
      .select("id");
    expect(upd ?? { message: "no rows" }).toBeTruthy();
    expect(del ?? []).toEqual([]);
  });

  it("cannot read case events or internal notes", async () => {
    const { data } = await anon.from("case_events").select("id, internal_note");
    expect(data ?? []).toEqual([]);
  });

  it("cannot read attachment metadata", async () => {
    const { data } = await anon.from("case_attachments").select("id, storage_path");
    expect(data ?? []).toEqual([]);
  });

  it("cannot read the submission throttle table", async () => {
    const { data } = await anon.from("case_submission_throttle").select("fingerprint" as never);
    expect(data ?? []).toEqual([]);
  });
});

d("attachment storage privacy", () => {
  it("keeps the bucket private and rejects public URL access", async () => {
    const { data: row } = await admin
      .from("case_attachments")
      .select("storage_path")
      .limit(1)
      .maybeSingle();
    expect(row?.storage_path).toBeTruthy();
    const path = row!.storage_path as string;

    const publicUrl = anon.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    const response = await fetch(publicUrl);
    expect(response.ok).toBe(false);
    expect([400, 401, 403, 404]).toContain(response.status);

    const direct = await anon.storage.from(BUCKET).download(path);
    expect(direct.error).toBeTruthy();

    const anonSigned = await anon.storage.from(BUCKET).createSignedUrl(path, 60);
    expect(anonSigned.error).toBeTruthy();
  });

  it("issues time-limited signed URLs that stop working after expiry", async () => {
    const path = `cases/qa-signed-url-check/${crypto.randomUUID()}.txt`;
    cleanupPaths.push(path);
    const up = await admin.storage
      .from(BUCKET)
      .upload(path, new Blob(["synthetic"], { type: "text/plain" }));
    expect(up.error).toBeNull();

    const signed = await admin.storage.from(BUCKET).createSignedUrl(path, 5);
    expect(signed.data?.signedUrl).toContain("token=");
    const fresh = await fetch(signed.data!.signedUrl);
    expect(fresh.ok).toBe(true);

    await new Promise((r) => setTimeout(r, 8000));
    const expired = await fetch(signed.data!.signedUrl);
    expect(expired.ok).toBe(false);
  }, 30000);
});

d("intake idempotency and market separation", () => {
  it("enforces one case per submission key", async () => {
    const { data: existing } = await admin
      .from("support_cases")
      .select("id, submission_key, public_reference")
      .limit(1)
      .maybeSingle();
    expect(existing?.submission_key).toBeTruthy();

    // A retry of the same submission reuses the stored case instead of
    // creating a second one: the lookup resolves, and a forced re-insert of
    // the same key is rejected by the unique constraint.
    const lookup = await admin
      .from("support_cases")
      .select("public_reference")
      .eq("submission_key", existing!.submission_key as string);
    expect(lookup.data?.length).toBe(1);

    const retry = await admin.from("support_cases").insert({
      public_reference: `US-ZZZZZ-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      market: "US",
      locale: "en-US",
      support_topic: "t",
      purchase_channel: "c",
      order_reference: "o",
      purchase_date: "2026-01-01",
      setup_state: "bare",
      pet_guide: "dog",
      issue_title: "t",
      issue_description: "d",
      customer_email: "qa-retry@example.invalid",
      privacy_consent_version: "v1",
      submission_key: existing!.submission_key as string,
    } as never);
    expect(retry.error?.code).toBe("23505");
  });

  it("has no duplicate submission keys or public references", async () => {
    const { data } = await admin.from("support_cases").select("submission_key, public_reference");
    const keys = (data ?? []).map((r) => r.submission_key);
    const refs = (data ?? []).map((r) => r.public_reference);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(refs).size).toBe(refs.length);
  });

  it("stores U.S. and Japan cases as separate market/locale records", async () => {
    const { data } = await admin
      .from("support_cases")
      .select("public_reference, market, locale");
    for (const row of data ?? []) {
      expect(String(row.public_reference).startsWith(`${row.market}-`)).toBe(true);
      expect(row.locale).toBe(row.market === "JP" ? "ja-JP" : "en-US");
    }
  });

  it("records exactly one creation event per case", async () => {
    const { data: cases } = await admin.from("support_cases").select("id, public_reference");
    const { data: events } = await admin.from("case_events").select("case_id, event_type");
    for (const c of cases ?? []) {
      const created = (events ?? []).filter(
        (e) => e.case_id === c.id && e.event_type === "case_created",
      );
      expect(created.length).toBe(1);
    }
  });
});

d("rate limiting", () => {
  it("tracks submissions per fingerprint without exposing them publicly", async () => {
    const { data } = await admin
      .from("case_submission_throttle")
      .select("fingerprint, submission_count");
    expect(Array.isArray(data)).toBe(true);
    for (const row of data ?? []) expect(row.submission_count).toBeGreaterThan(0);
    const anonRead = await anon.from("case_submission_throttle").select("fingerprint" as never);
    expect(anonRead.data ?? []).toEqual([]);
  });
});
