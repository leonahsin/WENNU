import { productImageForMarket } from "@/content/productImageUnits";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { HelpfulPrompt } from "@/components/site/HelpfulPrompt";
import { HOW_TO_REVIEW_NOTICE_JP, type HowToSectionId, howToSections } from "@/content/howToUse";
import type { MarketId } from "@/content/market";
import { useRecordSupportState, useScrollRestore } from "@/lib/useSupportSession";

const COPY = {
  us: {
    home: "PCI01 Support",
    homeTo: "/product/pci01",
    crumb: "Getting Started",
    title: "Getting started with PCI01",
    description: "Four steps, from picking a mode to learning what's normal for your pet.",
    steps: ["Mode", "Position", "Scan", "Baseline"],
    previous: "Previous",
    next: "Next",
    finish: "Finish guide",
    finished: "Guide complete",
    completeTitle: "You’ve reached the end of the guide",
    completeBody:
      "You’ve reviewed all four steps. Come back anytime for a refresher, or choose where to go next.",
    faqLabel: "Explore FAQ",
    faqHint: "Find answers and troubleshooting tips.",
    videosLabel: "Video Guides",
    videosHint: "Browse video topics and availability.",
    supportLabel: "Contact Support",
    supportHint: "Tell our team about your product issue.",
    backHome: "Back to PCI01 Support",
    outcome: "Got your first reading?",
    reading: "I have a reading, but what does it mean?",
    readingLink: "Understand pet temperature",
    trouble: "No reading, or the numbers keep changing?",
    troubleLink: "Find help in FAQ",
    notice: "",
  },
  jp: {
    home: "PCI01 サポート",
    homeTo: "/jp/product/pci01",
    crumb: "はじめてお使いになる方へ",
    title: "PCI01 を使い始める",
    description: "モード選択からふだんの目安づくりまで、4つのステップでご案内します。",
    steps: ["モード選択", "位置を整える", "続けて測る", "目安づくり"],
    previous: "前へ",
    next: "次へ",
    finish: "ガイドを終える",
    finished: "ガイド完了",
    completeTitle: "4つのステップのご案内は以上です",
    completeBody:
      "おつかれさまでした。いつでも手順を見直せます。引き続き確認したい内容をお選びください。",
    faqLabel: "FAQ を見る",
    faqHint: "よくある質問や困ったときの対処法を確認。",
    videosLabel: "動画ガイド",
    videosHint: "動画のテーマと公開状況を確認。",
    supportLabel: "サポートに相談",
    supportHint: "製品の症状を担当者にお知らせください。",
    backHome: "PCI01 サポートに戻る",
    outcome: "はじめての測定はできましたか？",
    reading: "測れたけれど、数値の見方がわからない",
    readingLink: "ペットの体温について",
    trouble: "測れない・数値が安定しない",
    troubleLink: "FAQ で解決方法を確認",
    notice: HOW_TO_REVIEW_NOTICE_JP,
  },
} as const;

const STEP_IMAGES: Record<HowToSectionId, { src: string; alt: { us: string; jp: string } }> = {
  "choose-your-mode": {
    src: "/images/pci01-step-mode-v1.png",
    alt: {
      us: "A pet owner selects the PCI01 mode with a calm dog and cat nearby.",
      jp: "落ち着いた犬と猫のそばで、飼い主が PCI01 のモードを選んでいます。",
    },
  },
  "position-the-thermometer": {
    src: "/images/pci01-step-position-v1.png",
    alt: {
      us: "A pet owner steadies a calm dog and positions PCI01 near its head.",
      jp: "飼い主が犬をやさしく支え、PCI01 を額の近くに安定させています。",
    },
  },
  "keep-scanning": {
    src: "/images/pci01-step-scan-v1.png",
    alt: {
      us: "A pet owner continues a gentle scan near a calm dog's head.",
      jp: "飼い主が落ち着いた犬の額から耳の近くをやさしく続けて測っています。",
    },
  },
  "learn-their-normal": {
    src: "/images/pci01-step-baseline-v1.png",
    alt: {
      us: "A pet owner records PCI01 readings while a dog and cat rest together.",
      jp: "犬と猫が一緒にくつろぐそばで、飼い主が PCI01 の測定結果を記録しています。",
    },
  },
};

function StepVisual({ id, market }: { id: HowToSectionId; market: MarketId }) {
  const image = STEP_IMAGES[id];

  return (
    <figure className="overflow-hidden rounded-[1.5rem] border border-warning/20 bg-[#fbf6e8] shadow-sm">
      <img
        src={productImageForMarket(image.src, market)}
        alt={image.alt[market]}
        width={764}
        height={508}
        loading="eager"
        className="aspect-[3/2] h-full w-full object-cover"
      />
    </figure>
  );
}

export function HowToUsePage({ market }: { market: MarketId }) {
  const copy = COPY[market];
  const sections = howToSections(market);
  const jp = market === "jp";
  const hash = useLocation({ select: (location) => location.hash });
  const navigate = useNavigate();
  const guideRef = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState(false);
  const completionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const activeIndex = Math.max(
    0,
    sections.findIndex((item) => item.id === hash.replace(/^#/, "")),
  );
  const section = sections[activeIndex]!;

  const finishGuide = () => {
    setCompleted(true);
    requestAnimationFrame(() => {
      completionRef.current?.focus({ preventScroll: true });
      completionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };

  const selectStep = async (index: number) => {
    setCompleted(false);
    const nextSection = sections[index];
    if (!nextSection) return;
    await navigate({
      to: jp ? "/jp/getting-started" : "/getting-started",
      hash: nextSection.id,
      resetScroll: false,
      hashScrollIntoView: false,
    });
    headingRef.current?.focus({ preventScroll: true });
    guideRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  };

  useScrollRestore(`${market}:getting-started`);
  useRecordSupportState({
    product: "PCI01",
    locale: jp ? "ja-JP" : "en-US",
    lastInstructional: `${jp ? "/jp" : ""}/getting-started`,
  });

  return (
    <>
      <PageHeader
        crumbs={[{ label: copy.home, to: copy.homeTo }, { label: copy.crumb }]}
        title={copy.title}
        description={copy.description}
      />

      <main lang={jp ? "ja" : "en"} className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div ref={guideRef} className="scroll-mt-24 space-y-4">
          <nav
            aria-label={jp ? "使い方のステップ" : "Getting started steps"}
            className="rounded-xl border border-primary/20 bg-secondary/50 px-3 pt-3 pb-2 sm:px-4"
          >
            <p className="mb-2 text-sm font-semibold" aria-live="polite">
              {jp ? `ステップ ${activeIndex + 1} / 4` : `Step ${activeIndex + 1} of 4`}
            </p>
            <ol className="grid grid-cols-4 gap-1.5 sm:gap-3">
              {sections.map((item, index) => (
                <li key={item.id} className="min-w-0">
                  <button
                    type="button"
                    aria-current={index === activeIndex ? "step" : undefined}
                    aria-controls="getting-started-panel"
                    onClick={() => void selectStep(index)}
                    aria-label={`${index + 1}. ${item.title}`}
                    className={`flex min-h-12 w-full flex-col gap-2 rounded text-left text-sm leading-snug focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === activeIndex ? "font-bold text-primary" : index < activeIndex ? "font-medium text-primary" : "text-muted-foreground"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-1.5 w-full rounded-full transition-colors ${index <= activeIndex ? "bg-primary" : "bg-border"}`}
                    />
                    <span>
                      <span aria-hidden="true">{index + 1} </span>
                      {copy.steps[index]}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div id="getting-started-panel">
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className={`scroll-mt-24 overflow-hidden rounded-[2rem] border bg-white p-4 shadow-sm sm:p-6 ${
                section.emphasis ? "border-primary/25 ring-1 ring-primary/10" : "border-border"
              }`}
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.78fr)] lg:items-center">
                <div className="order-2 min-w-0 px-1 pb-1 lg:order-1 lg:px-2">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className={`grid size-12 shrink-0 place-items-center rounded-full text-lg font-bold ${
                        section.emphasis
                          ? "bg-warning text-warning-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {activeIndex + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-warning">
                        {jp ? `ステップ ${activeIndex + 1}` : `Step ${activeIndex + 1}`}
                      </p>
                      <h2
                        ref={headingRef}
                        tabIndex={-1}
                        id={`${section.id}-heading`}
                        className={
                          section.emphasis
                            ? "mt-1 text-2xl font-semibold text-foreground"
                            : "mt-1 text-xl font-semibold text-foreground"
                        }
                      >
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-4 text-base font-medium text-foreground">{section.summary}</p>
                  <div className="mt-3 space-y-3 text-base leading-relaxed text-muted-foreground">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="break-words">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.pendingReview ? (
                    <p className="mt-3 rounded-lg bg-secondary px-4 py-3 text-sm text-foreground">
                      {copy.notice}
                    </p>
                  ) : null}
                </div>
                <div className="order-1 lg:order-2">
                  <StepVisual id={section.id} market={market} />
                </div>
              </div>
            </section>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => void selectStep(activeIndex - 1)}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-input bg-white px-5 py-3 text-sm font-semibold hover:bg-secondary disabled:cursor-default disabled:opacity-40"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {copy.previous}
            </button>
            <button
              type="button"
              disabled={completed && activeIndex === sections.length - 1}
              onClick={() =>
                activeIndex === sections.length - 1
                  ? finishGuide()
                  : void selectStep(activeIndex + 1)
              }
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-default disabled:opacity-40"
            >
              {activeIndex === sections.length - 1
                ? completed
                  ? copy.finished
                  : copy.finish
                : copy.next}
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        {completed && activeIndex === sections.length - 1 ? (
          <section
            ref={completionRef}
            tabIndex={-1}
            aria-labelledby="guide-complete-title"
            className="mt-8 mb-6 scroll-mt-24 rounded-[2rem] border border-primary/25 bg-secondary/60 p-5 sm:p-8"
          >
            <CheckCircle2 aria-hidden className="size-10 text-primary" />
            <p className="mt-4 text-sm font-bold text-primary">{copy.finished} · 4 / 4</p>
            <h2 id="guide-complete-title" className="mt-2 text-2xl font-bold">
              {copy.completeTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {copy.completeBody}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { to: jp ? "/jp/faq" : "/faq", label: copy.faqLabel, hint: copy.faqHint },
                {
                  to: jp ? "/jp/videos" : "/videos",
                  label: copy.videosLabel,
                  hint: copy.videosHint,
                },
                {
                  to: jp ? "/jp/support-request" : "/support-request",
                  label: copy.supportLabel,
                  hint: copy.supportHint,
                },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-2xl border border-primary/20 bg-white p-4 transition-colors hover:bg-secondary"
                >
                  <span className="flex items-center justify-between gap-2 font-bold text-primary">
                    {item.label}
                    <ArrowRight aria-hidden className="size-4 shrink-0" />
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                    {item.hint}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              to={copy.homeTo}
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4"
            >
              <ArrowLeft aria-hidden className="size-4" />
              {copy.backHome}
            </Link>
          </section>
        ) : null}

        {!(completed && activeIndex === sections.length - 1) ? (
          <aside aria-labelledby="reading-outcome" className="mt-8 mb-6">
            <h2 id="reading-outcome" className="text-lg font-semibold">
              {copy.outcome}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Link
                to={jp ? "/jp/pet-temperature" : "/pet-temperature"}
                className="rounded-2xl border border-primary/25 bg-secondary/40 p-4 transition-colors hover:bg-secondary"
              >
                <span className="block text-base font-semibold">{copy.reading}</span>
                <span className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  {copy.readingLink}
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                </span>
              </Link>
              <Link
                to={jp ? "/jp/faq" : "/faq"}
                hash="troubleshooting-inconsistent-measurements"
                className="rounded-2xl border border-primary/25 bg-secondary/40 p-4 transition-colors hover:bg-secondary"
              >
                <span className="block text-base font-semibold">{copy.trouble}</span>
                <span className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  {copy.troubleLink}
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                </span>
              </Link>
            </div>
          </aside>
        ) : null}
        <HelpfulPrompt market={market} contextLabel={copy.title} issueCategory={copy.crumb} />
      </main>
    </>
  );
}
