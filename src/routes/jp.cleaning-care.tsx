import { createFileRoute, redirect } from "@tanstack/react-router";

/** お手入れと保管は FAQ に統合しました。旧URLから該当箇所へ転送します。 */
export const Route = createFileRoute("/jp/cleaning-care")({
  beforeLoad: () => {
    throw redirect({ href: "/jp/faq#cleaning-care" });
  },
});
