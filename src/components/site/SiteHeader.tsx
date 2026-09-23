import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ExternalLink, Menu } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { AMAZON_URL } from "@/components/site/CommerceTrust";
import { marketForPath } from "@/content/market";
import { homeDestination } from "@/lib/supportSession";
import { useSupportSession } from "@/lib/useSupportSession";

const SUPPORT_NAV = {
  us: [
    { label: "Getting Started", to: "/getting-started" },
    { label: "Video Guides", to: "/videos" },
    { label: "FAQ", to: "/faq" },
    { label: "Support Request", to: "/support-request" },
  ],
  jp: [
    { label: "はじめてお使いになる方へ", to: "/jp/getting-started" },
    { label: "動画ガイド", to: "/jp/videos" },
    { label: "よくあるご質問", to: "/jp/faq" },
    { label: "サポート依頼", to: "/jp/support-request" },
  ],
} as const;

const PRODUCT_NAV = {
  us: [{ label: "PCI01", to: "/product/pci01" }, { label: "PCM01" }, { label: "PCM02" }],
  jp: [{ label: "PCI01", to: "/jp/product/pci01" }, { label: "PCM01" }, { label: "PCM02" }],
} as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routeHref = useRouterState({ select: (s) => s.location.href });
  const market = marketForPath(pathname);
  const isJp = market.id === "jp";
  const session = useSupportSession();
  const sourceFromUrl = new URL(routeHref, "https://support.local").searchParams.get("source");
  const entrySource = sourceFromUrl === "qr" ? "qr" : (session?.entrySource ?? "general");
  const isQr = entrySource === "qr";
  const home = homeDestination(isJp ? "ja-JP" : "en-US", entrySource);
  const neutral = pathname === "/" || pathname === "/jp";
  const nav = neutral ? PRODUCT_NAV[market.id] : SUPPORT_NAV[market.id];
  const brandLabel = neutral
    ? isJp
      ? "WENNU サポート"
      : "WENNU Support"
    : isJp
      ? "PCI01 サポート"
      : "PCI01 Support";

  const switchMarket = (nextMarket: "us" | "jp") => {
    if (nextMarket === market.id) return;
    setOpen(false);
    const target =
      nextMarket === "jp"
        ? pathname === "/"
          ? homeDestination("ja-JP", entrySource)
          : `/jp${pathname}`
        : pathname === "/jp"
          ? homeDestination("en-US", entrySource)
          : pathname.replace(/^\/jp/, "") || "/";
    void navigate({ to: target as NonNullable<LinkProps["to"]> });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          to={home as NonNullable<LinkProps["to"]>}
          {...(isQr ? { search: { source: "qr" } as const } : {})}
          className="tap-target flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <BrandLogo className="h-9 w-auto sm:h-10" />
          <span className="hidden text-sm font-semibold text-foreground sm:inline">
            {brandLabel}
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {neutral ? (
            <a
              href={AMAZON_URL}
              target="_blank"
              rel="noreferrer"
              className="tap-target hidden items-center gap-2 rounded-xl border-2 border-warning/30 bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:border-warning hover:text-warning md:inline-flex"
            >
              {isJp ? "Amazonで購入" : "Buy on Amazon"}
              <ExternalLink aria-hidden className="size-4" />
            </a>
          ) : null}

          <div
            role="group"
            aria-label={isJp ? "言語を選択" : "Choose language"}
            className="flex items-center rounded-full bg-[#f3e7d3] p-1"
          >
            <button
              type="button"
              aria-pressed={!isJp}
              onClick={() => switchMarket("us")}
              className={`tap-target min-w-12 rounded-full px-3 text-sm font-bold transition ${
                !isJp ? "bg-warning text-warning-foreground shadow-sm" : "text-[#75634f]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              aria-pressed={isJp}
              onClick={() => switchMarket("jp")}
              className={`tap-target rounded-full px-3 text-sm font-bold transition ${
                isJp ? "bg-warning text-warning-foreground shadow-sm" : "text-[#75634f]"
              }`}
            >
              日本語
            </button>
          </div>

          <button
            type="button"
            className="tap-target grid size-11 shrink-0 place-items-center rounded-xl text-primary transition hover:bg-secondary hover:text-warning"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu aria-hidden className="size-6" />
            <span className="sr-only">
              {open
                ? isJp
                  ? "メニューを閉じる"
                  : "Close menu"
                : isJp
                  ? "メニューを開く"
                  : "Open menu"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="site-menu"
          aria-label={isJp ? "サイトメニュー" : "Site menu"}
          className="border-t border-primary/10 bg-card shadow-lift"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-warning">
              {neutral ? (isJp ? "製品を選ぶ" : "Choose your product") : "PCI01"}
            </p>
            <ul className={neutral ? "grid gap-2 sm:grid-cols-3" : "grid grid-cols-2 gap-2 lg:grid-cols-4"}>
              {nav.map((item) => (
                <li key={item.label}>
                  {"to" in item && item.to ? (
                    <Link
                      to={item.to as NonNullable<LinkProps["to"]>}
                      {...(isQr && item.to.includes("product/pci01")
                        ? { search: { source: "qr" } as const }
                        : {})}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "border-primary bg-secondary text-primary" }}
                      className="tap-target flex items-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:border-warning hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="flex min-h-11 items-center rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm font-semibold text-muted-foreground/60">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
