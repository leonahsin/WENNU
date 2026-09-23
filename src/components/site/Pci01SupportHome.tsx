import { productImageForMarket } from "@/content/productImageUnits";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { PrimaryCardLink } from "@/components/site/PrimaryCard";
import { SupportSearch } from "@/components/site/SupportSearch";
import { HappyPetsReview } from "@/components/site/CommerceTrust";
import { primaryDestinations } from "@/content/pci01Home";
import type { MarketId } from "@/content/market";
import { useRecordSupportState, useSupportSession } from "@/lib/useSupportSession";
import { patchSupportState } from "@/lib/supportSession";
import type { EntrySource } from "@/lib/supportSession";

const COPY = {
  us: {
    title: "PCI01 Support",
    description: "Choose a guide, browse answers, or contact the support team.",
    productsTo: "/",
    products: "All products",
    quickLabel: "Popular questions",
    questions: [
      "How do I measure?",
      "How do I clean it?",
      "What does orange mean?",
      "What batteries does PCI01 use?",
      "Can dogs and cats both use it?",
      "Does it need an app or Wi-Fi?",
      "What should I do after a high-temperature alert?",
    ],
  },
  jp: {
    title: "PCI01 サポート",
    description: "お困りの内容をお選びください。",
    productsTo: "/jp",
    products: "製品一覧",
    quickLabel: "よくある質問",
    questions: [
      "測定方法は？",
      "お手入れ方法は？",
      "オレンジ表示の意味は？",
      "電池は何を使いますか？",
      "犬にも猫にも使えますか？",
      "アプリやWi-Fiは必要ですか？",
      "高温アラートが出たら？",
    ],
  },
} as const;

interface Props {
  market: MarketId;
  /** "qr" when the visitor arrived from a QR code or ?source=qr. */
  entrySource: EntrySource;
  /** URL-owned search query. */
  initialQuery: string;
}

/** Canonical PCI01 Support Home with four primary destinations. */
export function Pci01SupportHome({ market, entrySource, initialQuery }: Props) {
  const copy = COPY[market];
  const jp = market === "jp";
  const session = useSupportSession();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);

  // Router search is authoritative, including after native Back/Forward navigation.
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!session) return;
    patchSupportState({ searchQuery: query });
  }, [query, session]);

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    void navigate({
      to: jp ? "/jp/product/pci01" : "/product/pci01",
      search: {
        ...(entrySource === "qr" ? { source: "qr" as const } : {}),
        ...(nextQuery ? { q: nextQuery } : {}),
      },
      replace: true,
    });
  };

  useRecordSupportState({
    product: "PCI01",
    entrySource,
    locale: jp ? "ja-JP" : "en-US",
  });

  // QR visitors are never offered a route back to product selection.
  const isQr = entrySource === "qr" || session?.entrySource === "qr";

  return (
    <>
      <PageHeader
        crumbs={
          isQr
            ? [{ label: copy.title }]
            : [{ label: copy.products, to: copy.productsTo }, { label: copy.title }]
        }
        title={copy.title}
        description={
          <>
            <span className="hidden lg:inline">{copy.description}</span>
            <span className="lg:hidden">
              <span className="block whitespace-nowrap">
                {jp ? "使い方・よくある質問" : "Guides and answers."}
              </span>
              <span className="block whitespace-nowrap">
                {jp ? "サポートへ相談" : "Contact support."}
              </span>
            </span>
          </>
        }
        leadingMedia={
          <img
            src={productImageForMarket("/images/pci01-product-front-v5.png", market)}
            alt={jp ? "PCI01 ペット用体温計" : "PCI01 pet thermometer"}
            width={426}
            height={1522}
            fetchPriority="high"
            className="pci-support-thermometer"
          />
        }
        media={
          <img
            src="/images/golden-retriever-tabby-support-v1.png"
            alt={
              jp
                ? "仲良く寄り添うゴールデンレトリバーと猫"
                : "A golden retriever and cat sitting close together"
            }
            width={1254}
            height={1254}
            fetchPriority="high"
            className="pci-support-floating-pets"
          />
        }
      >
        <div className="max-w-3xl rounded-3xl border border-border bg-card/95 p-4 shadow-soft sm:p-5">
          <div className="min-w-0">
            <SupportSearch market={market} value={query} onChange={updateQuery} id="pci01-search" />
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground">{copy.quickLabel}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {copy.questions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => updateQuery(question)}
                  className="tap-target rounded-full border border-border bg-background px-4 py-2 text-left text-sm font-medium text-muted-foreground transition hover:-translate-y-0.5 hover:border-warning hover:text-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PageHeader>

      <main
        lang={jp ? "ja" : undefined}
        className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <section aria-label={copy.title} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {primaryDestinations(market).map((item) => (
            <PrimaryCardLink
              key={item.id}
              title={item.title}
              description={item.description}
              to={item.to}
              emphasis={item.emphasis}
              {...(jp ? { lang: "ja" } : {})}
            />
          ))}
        </section>
      </main>
      <HappyPetsReview market={market} showAmazon={false} />
    </>
  );
}
