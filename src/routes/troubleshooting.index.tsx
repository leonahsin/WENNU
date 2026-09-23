import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/troubleshooting/")({
  beforeLoad: () => {
    throw redirect({ to: "/faq", hash: "troubleshooting" });
  },
});
