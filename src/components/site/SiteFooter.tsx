import { Link, useRouterState } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { marketForPath } from "@/content/market";
import { FOOTER_LINKS_JP, FOOTER_LINKS_US } from "@/content/navigation";
import { BrandLogo } from "@/components/site/BrandLogo";

export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const market = marketForPath(pathname);
  const isJp = market.id === "jp";
  const neutral = pathname === "/" || pathname === "/jp";
  const links = neutral
    ? [{ label: "PCI01", to: isJp ? "/jp/product/pci01" : "/product/pci01" }]
    : isJp
      ? FOOTER_LINKS_JP
      : FOOTER_LINKS_US;

  return (
    <footer className="mt-16 border-t border-border bg-card" lang={isJp ? "ja" : undefined}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <BrandLogo className="h-9 w-auto" />
          <nav aria-label={isJp ? "フッターのリンク" : "Footer links"} className="min-w-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-warning">
              {neutral ? (isJp ? "製品" : "Products") : isJp ? "PCI01 サポート" : "PCI01 Support"}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to as NonNullable<LinkProps["to"]>}
                    className="break-words hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {neutral ? (
                <>
                  <li className="text-muted-foreground/50">PCM01</li>
                  <li className="text-muted-foreground/50">PCM02</li>
                </>
              ) : null}
            </ul>
          </nav>
        </div>
        <p className="mt-8 break-words border-t border-border pt-6 text-xs text-muted-foreground">
          {isJp
            ? "本サポート情報は、製品の使い方とお手入れに関するご案内です。診断や獣医療のご助言は行っておりません。"
            : "Support content helps with product use and care. It does not provide diagnosis or veterinary advice."}
        </p>
      </div>
    </footer>
  );
}
