import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import type { MarketId } from "@/content/market";
import { customerReviews } from "@/content/customer-reviews";

export const AMAZON_URL = "https://www.amazon.com/s?k=WENNU+FurGlo+PCI01";

export function AmazonButton({ market }: { market: MarketId }) {
  return (
    <a
      href={AMAZON_URL}
      target="_blank"
      rel="noreferrer"
      className="tap-target inline-flex items-center justify-center gap-2 rounded-xl bg-warning px-6 py-3 text-sm font-bold text-warning-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {market === "jp" ? "Amazonで購入" : "Buy on Amazon"}
      <ExternalLink aria-hidden className="size-4" />
    </a>
  );
}

export function HappyPetsReview({
  market,
  showAmazon = true,
}: {
  market: MarketId;
  showAmazon?: boolean;
}) {
  const jp = market === "jp";
  const reviews = customerReviews.map((review) => ({
    ...review,
    text: jp ? review.jp : review.en,
  }));
  const [activeReview, setActiveReview] = useState(0);
  const [animateReview, setAnimateReview] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const timer = window.setInterval(() => setActiveReview((current) => current + 1), 7000);
    return () => window.clearInterval(timer);
  }, [reviews.length]);

  return (
    <section
      className="border-y border-primary/10 bg-[#fffbf5]"
      aria-label={jp ? "お客様の声" : "Customer review"}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-9 text-center sm:px-6 sm:py-12">
        <h2 className="review-serif text-3xl font-bold text-[#35271b] sm:text-4xl">
          1000+ Happy Pets
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {jp
            ? "米国Amazon Vineの星5レビューから選んだ要約・日本語訳"
            : "Selected 5-star Amazon Vine review summaries"}
        </p>
        <div className="mt-5 overflow-hidden">
          <div
            className={`flex ease-out motion-reduce:transition-none ${
              animateReview ? "transition-transform duration-700" : ""
            }`}
            style={{ transform: `translate3d(-${activeReview * 100}%, 0, 0)` }}
            onTransitionEnd={() => {
              if (activeReview !== reviews.length) return;
              setAnimateReview(false);
              setActiveReview(0);
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => setAnimateReview(true));
              });
            }}
          >
            {[...reviews, reviews[0]!].map((review, index) => (
              <figure key={`${review.who}-${index}`} className="w-full shrink-0 px-4">
                <p className="review-serif mx-auto max-w-4xl text-2xl font-normal italic leading-relaxed text-[#35271b] sm:text-3xl">
                  {jp ? `「${review.text}」` : `“${review.text}”`}
                </p>
                <figcaption className="review-serif mt-4 text-base font-normal text-[#35271b] sm:text-lg">
                  — {review.who} ★★★★★
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div
          className="mt-4 flex justify-center gap-2"
          aria-label={jp ? "レビューを選択" : "Choose a review"}
        >
          {reviews.map((review, index) => (
            <button
              key={review.who}
              type="button"
              onClick={() => {
                setAnimateReview(true);
                setActiveReview(index);
              }}
              aria-label={jp ? `レビュー${index + 1}` : `Review ${index + 1}`}
              aria-current={activeReview % reviews.length === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${
                activeReview % reviews.length === index
                  ? "w-8 bg-warning"
                  : "w-2.5 bg-primary/20 hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
        {showAmazon ? (
          <div className="mt-5">
            <AmazonButton market={market} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
