import { createFileRoute, redirect } from "@tanstack/react-router";

/** Cleaning & Care now lives inside FAQ. Keep this URL as a safe redirect. */
export const Route = createFileRoute("/cleaning-care")({
  beforeLoad: () => {
    throw redirect({ href: "/faq#cleaning-care" });
  },
});
