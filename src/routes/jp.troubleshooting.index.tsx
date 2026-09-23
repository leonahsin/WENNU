import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jp/troubleshooting/")({
  beforeLoad: () => {
    throw redirect({ to: "/jp/faq", hash: "troubleshooting" });
  },
});
