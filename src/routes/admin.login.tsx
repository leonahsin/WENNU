import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff sign-in — PCI01 support console" },
      {
        name: "description",
        content: "Internal sign-in for the PCI01 support case console.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/admin/cases" });
    });
  }, [navigate]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signInError) {
      // Deliberately generic: never reveal whether an account exists.
      setError("Sign-in failed. Check the email address and password and try again.");
      return;
    }
    void navigate({ to: "/admin/cases" });
  };

  const control =
    "tap-target mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-base text-foreground";

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <div className="surface-card p-6">
        <h1 className="text-2xl font-semibold">Staff sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          For the internal PCI01 support team. Customers do not need an account to send a request.
        </p>

        <form className="mt-6 space-y-4" onSubmit={signIn} noValidate>
          {error ? (
            <p role="alert" className="rounded-lg border border-destructive/50 bg-warning-soft p-3 text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}
          <div>
            <label htmlFor="email" className="text-sm font-semibold">
              Work email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={control}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={control}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="tap-target w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Staff accounts and roles are created by an administrator. Internal configuration required
          before launch.
        </p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">
          Back to Support Home
        </Link>
      </div>
    </main>
  );
}
