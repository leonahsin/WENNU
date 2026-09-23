import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jp/troubleshooting/wont-turn-on")({
  beforeLoad: () => {
    throw redirect({ to: "/jp/faq", hash: "troubleshooting-wont-turn-on" });
  },
});
