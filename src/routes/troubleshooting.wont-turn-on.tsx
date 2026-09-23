import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/troubleshooting/wont-turn-on")({
  beforeLoad: () => {
    throw redirect({ to: "/faq", hash: "troubleshooting-wont-turn-on" });
  },
});
