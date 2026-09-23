import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminGate } from "@/components/admin/AdminGate";
import {
  getSupportCase,
  updateSupportCaseStatus,
  type CaseDetail,
} from "@/lib/supportCases.functions";
import { CASE_STATUSES, type CaseStatus } from "@/lib/caseIntake";

export const Route = createFileRoute("/admin/cases/$caseId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Case detail — PCI01 console" },
      { name: "description", content: "Internal PCI01 support case detail and timeline." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AdminGate>{(access) => <CaseDetailView isAdmin={access.isAdmin} />}</AdminGate>,
});

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  triaged: "Triaged",
  awaiting_customer: "Awaiting customer",
  in_review: "In review",
  resolved: "Resolved",
  closed: "Closed",
};

const HIDDEN_FIELDS = new Set(["id"]);

function CaseDetailView({ isAdmin }: { isAdmin: boolean }) {
  const { caseId } = useParams({ from: "/admin/cases/$caseId" });
  const fetchCase = useServerFn(getSupportCase);
  const changeStatus = useServerFn(updateSupportCaseStatus);

  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<CaseStatus>("new");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const result = await fetchCase({ data: { id: caseId } });
      setDetail(result);
      setStatus((result.caseRecord["status"] as CaseStatus) ?? "new");
      setError("");
    } catch {
      setError("This case could not be loaded.");
    }
  }, [caseId, fetchCase]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    try {
      await changeStatus({
        data: { id: caseId, status, ...(note.trim() ? { internalNote: note.trim() } : {}) },
      });
      setNote("");
      await load();
    } catch {
      setError("The status could not be changed. Only administrators can update a case.");
    } finally {
      setBusy(false);
    }
  };

  if (error && !detail) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">{error}</p>;
  }
  if (!detail) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Loading case…</p>;
  }

  const record = detail.caseRecord;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/admin/cases" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
        ← All cases
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">{String(record["public_reference"] ?? "")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {String(record["market"] ?? "")} · {STATUS_LABEL[String(record["status"])] ?? ""} ·{" "}
        {String(record["support_topic"] ?? "")}
      </p>

      {error ? (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/50 bg-warning-soft p-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      <section className="surface-card mt-6 p-5">
        <h2 className="text-lg font-semibold">Case details</h2>
        <dl className="mt-3 space-y-2 text-sm">
          {Object.entries(record)
            .filter(([key]) => !HIDDEN_FIELDS.has(key))
            .map(([key, value]) => (
              <div key={key} className="grid gap-1 sm:grid-cols-[220px_1fr]">
                <dt className="font-medium text-muted-foreground">{key.replace(/_/g, " ")}</dt>
                <dd className="break-words text-foreground">
                  {Array.isArray(value) ? value.join(", ") : String(value ?? "—")}
                </dd>
              </div>
            ))}
        </dl>
      </section>

      <section className="surface-card mt-6 p-5">
        <h2 className="text-lg font-semibold">Attachments</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Files are private. These preview links are short-lived and expire automatically.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {detail.attachments.length === 0 ? <li className="text-muted-foreground">No files.</li> : null}
          {detail.attachments.map((file) => (
            <li key={file.id} className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{file.attachment_type.replace(/_/g, " ")}:</span>
              {file.signedUrl ? (
                <a
                  href={file.signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  {file.original_filename}
                </a>
              ) : (
                <span>{file.original_filename}</span>
              )}
              <span className="text-muted-foreground">
                ({Math.round(file.size_bytes / 1024)} KB, {file.mime_type})
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card mt-6 p-5">
        <h2 className="text-lg font-semibold">Status and internal notes</h2>
        {isAdmin ? (
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="status" className="text-sm font-semibold">
                Status
              </label>
              <select
                id="status"
                className="tap-target mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
              >
                {CASE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="note" className="text-sm font-semibold">
                Internal note (never shown to the customer)
              </label>
              <textarea
                id="note"
                rows={3}
                maxLength={1000}
                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => void save()}
              disabled={busy}
              className="tap-target rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save status change"}
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Only administrators can change a case status.
          </p>
        )}
      </section>

      <section className="surface-card mt-6 p-5">
        <h2 className="text-lg font-semibold">Timeline</h2>
        <ol className="mt-3 space-y-3 text-sm">
          {detail.events.map((event) => (
            <li key={event.id} className="border-l-2 border-border pl-3">
              <p className="font-medium">{event.event_type.replace(/_/g, " ")}</p>
              <p className="text-muted-foreground">
                {event.previous_status ? `${event.previous_status} → ` : ""}
                {event.new_status ?? ""} · {new Date(event.created_at).toLocaleString()}
              </p>
              {event.internal_note ? <p className="mt-1">{event.internal_note}</p> : null}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
