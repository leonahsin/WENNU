import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminGate } from "@/components/admin/AdminGate";
import { supabase } from "@/integrations/supabase/client";
import { listSupportCases, type CaseListRow } from "@/lib/supportCases.functions";
import { CASE_STATUSES, type CaseStatus } from "@/lib/caseIntake";

export const Route = createFileRoute("/admin/cases/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Support cases — PCI01 console" },
      { name: "description", content: "Internal triage list of PCI01 support cases." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AdminGate>{() => <CaseList />}</AdminGate>,
});

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  triaged: "Triaged",
  awaiting_customer: "Awaiting customer",
  in_review: "In review",
  resolved: "Resolved",
  closed: "Closed",
};

function CaseList() {
  const load = useServerFn(listSupportCases);
  const [rows, setRows] = useState<CaseListRow[] | null>(null);
  const [error, setError] = useState("");
  const [market, setMarket] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const filters = useMemo(
    () => ({
      ...(market ? { market: market as "US" | "JP" } : {}),
      ...(status ? { status: status as CaseStatus } : {}),
      ...(fromDate ? { fromDate } : {}),
      ...(toDate ? { toDate } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
    }),
    [market, status, fromDate, toDate, search],
  );

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      load({ data: filters })
        .then((result) => {
          if (active) {
            setRows(result);
            setError("");
          }
        })
        .catch(() => active && setError("Cases could not be loaded."));
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filters, load]);

  const control =
    "tap-target mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Support cases</h1>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="tap-target rounded-lg border border-input bg-card px-4 py-2 text-sm font-semibold"
        >
          Sign out
        </button>
      </div>

      <section className="surface-card mt-6 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="filter-market" className="text-sm font-semibold">
            Market
          </label>
          <select
            id="filter-market"
            className={control}
            value={market}
            onChange={(e) => setMarket(e.target.value)}
          >
            <option value="">All</option>
            <option value="US">United States</option>
            <option value="JP">Japan</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter-status" className="text-sm font-semibold">
            Status
          </label>
          <select
            id="filter-status"
            className={control}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            {CASE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-from" className="text-sm font-semibold">
            From
          </label>
          <input
            id="filter-from"
            type="date"
            className={control}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filter-to" className="text-sm font-semibold">
            To
          </label>
          <input
            id="filter-to"
            type="date"
            className={control}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filter-search" className="text-sm font-semibold">
            Reference or order
          </label>
          <input
            id="filter-search"
            className={control}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="US-ABCDE-12345"
          />
        </div>
      </section>

      <p role="status" aria-live="polite" className="mt-4 text-sm text-muted-foreground">
        {error
          ? error
          : rows === null
            ? "Loading cases…"
            : `${rows.length} ${rows.length === 1 ? "case" : "cases"} shown`}
      </p>

      <ul className="mt-4 space-y-3">
        {(rows ?? []).map((row) => (
          <li key={row.id} className="surface-card p-4">
            <Link
              to="/admin/cases/$caseId"
              params={{ caseId: row.id }}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {row.public_reference}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {row.market} · {STATUS_LABEL[row.status] ?? row.status} · {row.support_topic}
            </p>
            <p className="text-sm text-muted-foreground">
              {row.order_reference ? `Amazon order ${row.order_reference} · ` : ""}
              {new Date(row.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
