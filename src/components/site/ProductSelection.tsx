import { productImageForMarket } from "@/content/productImageUnits";
import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HappyPetsReview } from "@/components/site/CommerceTrust";
import { catalogForMarket } from "@/content/catalog";
import type { MarketId } from "@/content/market";
import { useRecordSupportState } from "@/lib/useSupportSession";

const COPY = {
  us: {
    titleA: "Know your pet.",
    titleB: "Love them better.",
    lead: "Everything you need to use and care for your PCI01 — step-by-step guides, helpful videos, troubleshooting, and AI-powered support.",
    mobileLead: "Guides, care and support for your PCI01.",
    imageAlt: "PCI01 pet thermometer in blue and white",
    productImageAlt: "Front-facing blue and white PCI01 pet thermometer standing upright",
    petFamilyImageAlt:
      "Small Cavalier and Ragdoll cat sitting closely in front of a large Australian Shepherd",
    chooseTitle: "Choose your product",
    chooseLead: "Select your product to find guides, videos and troubleshooting.",
    support: "View support",
    available: "Support available",
  },
  jp: {
    titleA: "大切な家族を、もっと知る。",
    titleB: "もっとやさしく。",
    lead: "PCI01を安心してお使いいただくための、手順ガイド、動画、お手入れ方法、トラブル解決、AIサポートをご案内します。",
    mobileLead: "PCI01の使い方・お手入れ・サポートをご案内します。",
    imageAlt: "ブルーとホワイトのPCI01ペット用体温計",
    productImageAlt: "正面を向いて直立したブルーとホワイトのPCI01ペット用体温計",
    petFamilyImageAlt:
      "大型のオーストラリアン・シェパードの前で寄り添って座る小型のキャバリアとラグドール",
    chooseTitle: "製品を選ぶ",
    chooseLead: "製品を選んで、使い方・動画・トラブル解決をご覧ください。",
    support: "サポートを見る",
    available: "サポート公開中",
  },
} as const;

/** General support entry with the PCI01-first visual home experience. */
export function ProductSelection({ market }: { market: MarketId }) {
  const copy = COPY[market];
  const jp = market === "jp";
  const catalog = catalogForMarket(market);

  useRecordSupportState({ entrySource: "general", locale: jp ? "ja-JP" : "en-US" });

  return (
    <main lang={jp ? "ja" : undefined} className="overflow-hidden">
      <section className="hero-support relative">
        <div className="home-hero-grid mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="home-hero-copy relative z-10 min-w-0">
            <h1 className="max-w-3xl text-[clamp(1.25rem,5.4vw,2rem)] font-bold leading-[1.12] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-7xl">
              {copy.titleA}
              <span className="mt-1 block text-warning">{copy.titleB}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground lg:mt-6 lg:text-xl">
              <span className="lg:hidden">{copy.mobileLead}</span>
              <span className="hidden lg:inline">{copy.lead}</span>
            </p>
          </div>

          <div className="home-product-stage hero-product-stage relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="hero-orbits" aria-hidden="true">
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
            </div>
            <div className="hero-product-layout">
              <div className="hero-product-slot hero-product-slot--thermometer">
                <img
                  src={productImageForMarket("/images/pci01-product-front-v5.png", market)}
                  alt={copy.productImageAlt}
                  loading="eager"
                  decoding="async"
                  className="hero-product-subject hero-product-subject--thermometer"
                />
              </div>
              <div className="hero-pet-group">
                <img
                  src="/images/pet-family-v1.png"
                  alt={copy.petFamilyImageAlt}
                  loading="eager"
                  decoding="async"
                  className="hero-pet-family"
                />
              </div>
            </div>
            <div className="hero-product-shadow" />
          </div>
        </div>
      </section>

      <section
        className="choose-product-section border-y border-border"
        aria-labelledby="product-list"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:py-20">
          <div className="max-w-2xl">
            <h2
              id="product-list"
              className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {copy.chooseTitle}
            </h2>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">{copy.chooseLead}</p>
          </div>
          <ul className="mt-4 grid gap-4 sm:mt-7 sm:grid-cols-3">
            {catalog.map((entry) => (
              <li key={entry.id}>
                {entry.available && entry.to ? (
                  <Link
                    to={entry.to as NonNullable<LinkProps["to"]>}
                    className="group grid h-full grid-cols-[5.5rem_minmax(0,1fr)] sm:flex sm:min-h-[22rem] sm:flex-col overflow-hidden rounded-3xl border-2 border-primary bg-card shadow-soft transition hover:-translate-y-1 hover:border-warning hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <div className="relative grid place-items-center bg-secondary/70 p-2 sm:min-h-52 sm:p-5">
                      <span className="absolute left-4 top-4 hidden rounded-full sm:block bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        {copy.available}
                      </span>
                      <img
                        src={productImageForMarket("/images/pci01-hero.jpg", market)}
                        alt={copy.imageAlt}
                        loading="lazy"
                        decoding="async"
                        className="h-28 w-full sm:h-48 object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
                      <p className="hidden text-xs font-bold tracking-[0.15em] sm:block text-warning">
                        {entry.id.toUpperCase()}
                      </p>
                      <h3 className="text-xl font-semibold sm:mt-2 sm:text-2xl text-foreground">{entry.name}</h3>
                      <p className="mt-2 flex-1 text-base text-muted-foreground">
                        {entry.description}
                      </p>
                      <span className="mt-3 inline-flex min-h-11 items-center sm:mt-5 gap-2 font-semibold text-primary">
                        {copy.support}
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="grid h-full grid-cols-[5.5rem_minmax(0,1fr)] sm:flex sm:min-h-[22rem] sm:flex-col overflow-hidden rounded-3xl border border-border bg-card/70">
                    <div className="grid place-items-center bg-muted/70 p-2 sm:min-h-52 sm:p-6">
                      <span className="grid size-16 place-items-center sm:size-28 rounded-full border border-dashed border-primary/30 bg-card text-sm font-bold tracking-[0.12em] sm:text-xl text-primary/50">
                        {entry.id.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
                      <p className="hidden text-xs font-bold tracking-[0.15em] sm:block text-muted-foreground">
                        {entry.id.toUpperCase()}
                      </p>
                      <h3 className="text-xl font-semibold sm:mt-2 sm:text-2xl text-foreground">{entry.name}</h3>
                      <p className="mt-2 flex-1 text-base text-muted-foreground">
                        {entry.description}
                      </p>
                      <span className="mt-5 inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {entry.comingSoonLabel}
                      </span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <HappyPetsReview market={market} />
    </main>
  );
}
