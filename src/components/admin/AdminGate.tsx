import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getStaffAccess, type StaffAccess } from "@/lib/supportCases.functions";

type GateState =
  | { phase: "loading" }
  | { phase: "signed-out" }
  | { phase: "no-role" }
  | { phase: "ready"; access: StaffAccess };

/**
 * Client-side convenience gate for the internal case console.
 * Real enforcement lives in row-level security and the server functions:
 * a signed-in user without a support role receives no case data at all.
 */
export function AdminGate({ children }: { children: (access: StaffAccess) => ReactNode }) {
  const [state, setState] = useState<GateState>({ phase: "loading" });
  const loadAccess = useServerFn(getStaffAccess);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        setState({ phase: "signed-out" });
        return;
      }
      try {
        const access = await loadAccess();
        if (!active) return;
        setState(access.isStaff ? { phase: "ready", access } : { phase: "no-role" });
      } catch {
        if (active) setState({ phase: "no-role" });
      }
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") void check();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadAccess]);

  if (state.phase === "loading") {
    return (
      <p className="mx-auto w-full max-w-3xl px-4 py-16 text-sm text-muted-foreground">
        Checking your access…
      </p>
    );
  }

  if (state.phase === "signed-out") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="surface-card p-6">
          <h1 className="text-xl font-semibold">Staff sign-in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The case console is for the internal support team.
          </p>
          <Link
            to="/admin/login"
            className="tap-target mt-5 inline-flex items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Go to staff sign-in
          </Link>
        </div>
      </div>
    );
  }

  if (state.phase === "no-role") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="surface-card p-6">
          <h1 className="text-xl font-semibold">No case access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account is signed in but has no support role, so no case data is available.
          </p>
          <button
            type="button"
            onClick={() => void supabase.auth.signOut()}
            className="tap-target mt-5 inline-flex items-center rounded-lg border border-input bg-card px-5 py-3 text-sm font-semibold"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children(state.access)}</>;
}
