import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { useState } from "react";
import { patchSupportState } from "@/lib/supportSession";
import type { MarketId } from "@/content/market";

interface HelpfulPromptProps {
  market: MarketId;
  /** Non-personal context carried into Contact Support. */
  contextLabel: string;
  issueCategory?: string;
}

const COPY = {
  us: {
    helpful: "Was this helpful?",
    yes: "Yes",
    no: "No",
    thanks: "Thanks for letting us know.",
    still: "Still need help?",
    contact: "Contact Support",
    contactTo: "/support-request",
  },
  jp: {
    helpful: "この内容は役に立ちましたか？",
    yes: "はい",
    no: "いいえ",
    thanks: "ご回答ありがとうございます。",
    still: "解決しない場合",
    contact: "お問い合わせ",
    contactTo: "/jp/contact",
  },
} as const;

/**
 * "Was this helpful?" then "Still need help?" then Contact Support.
 * Feedback stays in the page — nothing is submitted and no personal data is
 * collected. Only non-personal context is carried into the contact flow.
 */
export function HelpfulPrompt({ market, contextLabel, issueCategory }: HelpfulPromptProps) {
  const copy = COPY[market];
  const [answered, setAnswered] = useState(false);

  const carryContext = () => {
    patchSupportState({
      contextLabel,
      issueCategory: issueCategory ?? null,
      product: "PCI01",
      locale: market === "jp" ? "ja-JP" : "en-US",
    });
  };

  return (
    <div
      lang={market === "jp" ? "ja" : undefined}
      className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm"
    >
      <span className="font-semibold text-foreground">{copy.helpful}</span>
      {answered ? (
        <span className="text-muted-foreground">{copy.thanks}</span>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setAnswered(true)}
            className="tap-target rounded-full border border-input px-4 py-1.5 font-medium hover:bg-secondary"
          >
            {copy.yes}
          </button>
          <button
            type="button"
            onClick={() => setAnswered(true)}
            className="tap-target rounded-full border border-input px-4 py-1.5 font-medium hover:bg-secondary"
          >
            {copy.no}
          </button>
        </>
      )}
      <span className="ml-auto text-muted-foreground">
        {copy.still}{" "}
        <Link
          to={copy.contactTo as NonNullable<LinkProps["to"]>}
          onClick={carryContext}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          {copy.contact}
        </Link>
      </span>
    </div>
  );
}
