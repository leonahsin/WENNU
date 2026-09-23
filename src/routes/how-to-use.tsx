import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy name retained as a redirect to the single canonical guide. */
export const Route = createFileRoute("/how-to-use")({
  beforeLoad: () => {
    throw redirect({ to: "/getting-started" });
  },
});
