import { PageHeader } from "@/components/site/PageHeader";
import { HelpfulPrompt } from "@/components/site/HelpfulPrompt";
import {
  PET_TEMPERATURE_REVIEW_JP,
  PET_TEMPERATURE_REVIEW_US,
  petTemperatureSections,
} from "@/content/petTemperature";
import type { MarketId } from "@/content/market";
import { useScrollRestore } from "@/lib/useSupportSession";

const COPY = {
  us: {
    home: "PCI01 Support",
    homeTo: "/product/pci01",
    crumb: "Pet Temperature",
    title: "Understanding pet temperature",
    description:
      "General everyday-care information. PCI01 observes temperature trends and does not diagnose anything.",
    notice: PET_TEMPERATURE_REVIEW_US,
  },
  jp: {
    home: "PCI01 サポート",
    homeTo: "/jp/product/pci01",
    crumb: "ペットの体温",
    title: "ペットの体温について",
    description:
      "毎日のケアのための一般的なご案内です。PCI01 は体温傾向の観察を目的としており、診断を行うものではありません。",
    notice: PET_TEMPERATURE_REVIEW_JP,
  },
} as const;

export function PetTemperaturePage({ market }: { market: MarketId }) {
  const copy = COPY[market];
  const jp = market === "jp";
  const sections = petTemperatureSections(market);
  useScrollRestore(`${market}:pet-temperature`);

  return (
    <>
      <PageHeader
        crumbs={[{ label: copy.home, to: copy.homeTo }, { label: copy.crumb }]}
        title={copy.title}
        description={copy.description}
      />

      <main lang={jp ? "ja" : undefined} className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="surface-card scroll-mt-24 p-6"
            >
              <h2 id={`${section.id}-heading`} className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-base text-muted-foreground">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="break-words">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.pendingReview ? (
                <p className="mt-1 rounded-lg bg-secondary px-4 py-3 text-sm text-foreground">
                  {copy.notice}
                </p>
              ) : null}
            </section>
          ))}
        </div>

        <HelpfulPrompt market={market} contextLabel={copy.crumb} issueCategory={copy.crumb} />

      </main>
    </>
  );
}
