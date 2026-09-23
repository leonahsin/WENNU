import { createFileRoute, redirect } from "@tanstack/react-router";

/** 旧名称は、統一された「はじめてお使いになる方へ」へ転送します。 */
export const Route = createFileRoute("/jp/how-to-use")({
  beforeLoad: () => {
    throw redirect({ to: "/jp/getting-started" });
  },
});
