import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link, useRouterState } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { marketForPath } from "@/content/market";
import { AssistantContext } from "@/components/site/support-assistant-context";

type Market = "us" | "jp";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
  thinking?: boolean;
  to?: string;
  linkLabel?: string;
}

const COPY = {
  us: {
    fab: "ASK WENNU",
    title: "ASK WENNU",
    subtitle: "Quick answers for PCI01",
    placeholder: "Ask a question about PCI01…",
    send: "Send",
    close: "Close support assistant",
    greeting:
      "Hi! I can point you to the right PCI01 guide. Ask about setup, readings, cleaning, or troubleshooting.",
    suggestions: [
      "How do I measure?",
      "How do I clean it?",
      "What does orange mean?",
      "Talk to a human",
    ],
  },
  jp: {
    fab: "ASK WENNU",
    title: "ASK WENNU",
    subtitle: "PCI01のご案内",
    placeholder: "PCI01について質問する…",
    send: "送信",
    close: "サポートアシスタントを閉じる",
    greeting: "こんにちは。PCI01の初期設定、測定値、お手入れ、トラブル解決についてご案内します。",
    suggestions: [
      "測定方法は？",
      "お手入れ方法は？",
      "オレンジ表示の意味は？",
      "担当者に相談したい",
    ],
  },
} as const;

function answerFor(question: string, market: Market): Omit<Message, "id" | "role"> {
  const query = question.toLocaleLowerCase();
  const jp = market === "jp";

  if (
    /talk to a person|person|human|support team|agent|representative|担当者|スタッフ|人に相談/.test(
      query,
    )
  ) {
    return {
      text: jp
        ? "もちろんです。保証、返品、その他のお困りごとについてサポートチームがお手伝いします。service@techncare.jp へメールでお問い合わせください。1営業日以内にご返信します。"
        : "Of course — our support team can help with warranty, returns and anything else. Email service@techncare.jp and we'll get back to you within 1 business day.",
      to: jp ? "/jp/support-request" : "/support-request",
      linkLabel: jp ? "サポート依頼を見る" : "Open support request",
    };
  }

  if (/clean|wash|wipe|お手入れ|洗|拭/.test(query)) {
    return {
      text: jp
        ? "測定面をやさしく拭き、本体に水が入らないようにしてください。詳しい手順はこちらです。"
        : "Gently wipe the measuring surface and keep moisture out of the device. Here are the complete care steps.",
      to: jp ? "/jp/faq#cleaning-care" : "/faq#cleaning-care",
      linkLabel: jp ? "FAQのお手入れ手順を見る" : "View care steps in FAQ",
    };
  }

  if (/orange|backlight|オレンジ|バックライト/.test(query)) {
    return {
      text: jp
        ? "オレンジ表示は高めの数値が検出されたことを示します。色はケアのための目安であり、診断ではありません。"
        : "Orange means a higher reading was detected. It is a care prompt, not a diagnosis.",
      to: jp ? "/jp/faq#faq-orange-backlight" : "/faq#faq-orange-backlight",
      linkLabel: jp ? "表示の説明を見る" : "View the full answer",
    };
  }

  if (/measure|how do i use pci01|測定方法|測り方|pci01の使い方/.test(query)) {
    return {
      text: jp
        ? "PCI01の電源を入れ、犬用または猫用の設定を選んでから、手順に沿って測定してください。"
        : "Turn PCI01 on, choose dog or cat mode, and follow the step-by-step guide to complete a consistent reading.",
      to: jp ? "/jp/getting-started" : "/getting-started",
      linkLabel: jp ? "測定手順を見る" : "Open measurement guide",
    };
  }

  if (/read|temperature|different|wrong|accuracy|測定|温度|体温|数値/.test(query)) {
    return {
      text: jp
        ? "測定位置や距離、モードによって数値が変わることがあります。確認ポイントをご案内します。"
        : "Placement, distance, and the selected mode can affect a reading. Check these troubleshooting steps first.",
      to: jp ? "/jp/faq#troubleshooting" : "/faq#troubleshooting",
      linkLabel: jp ? "FAQ・トラブル解決を見る" : "Open FAQ & troubleshooting",
    };
  }

  if (/use|start|setup|first|使い方|初め|設定/.test(query)) {
    return {
      text: jp
        ? "まずモードを選び、測定位置を確認してから測定してください。手順を順番にご覧いただけます。"
        : "Start by selecting the correct mode and confirming the measuring location. The step-by-step guide will walk you through it.",
      to: jp ? "/jp/getting-started" : "/getting-started",
      linkLabel: jp ? "使い方を見る" : "Open getting started",
    };
  }

  if (/manual|guide|説明書|マニュアル/.test(query)) {
    return {
      text: jp
        ? "PCI01の製品サポートページから、使い方や関連ガイドをご確認いただけます。"
        : "The PCI01 product support page collects the available instructions and related guides.",
      to: jp ? "/jp/product/pci01" : "/product/pci01",
      linkLabel: jp ? "製品サポートへ" : "Open product support",
    };
  }

  return {
    text: jp
      ? "該当するご案内をすぐに特定できませんでした。よくある質問を確認するか、サポートへお問い合わせください。"
      : "I couldn’t match that to a specific guide yet. Try the FAQs or send the support team your question.",
    to: jp ? "/jp/faq" : "/faq",
    linkLabel: jp ? "よくある質問を見る" : "Browse FAQs",
  };
}

export function SupportAssistantProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const market = marketForPath(pathname).id as Market;
  const copy = COPY[market];
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const nextId = useRef(2);
  const responseTimer = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", text: COPY.us.greeting },
  ]);

  const value = useMemo(() => ({ openAssistant: () => setOpen(true) }), []);

  const resetForMarket = () => {
    if (responseTimer.current !== null) {
      window.clearTimeout(responseTimer.current);
      responseTimer.current = null;
    }
    setIsThinking(false);
    setMessages([{ id: 1, role: "assistant", text: copy.greeting }]);
    nextId.current = 2;
  };

  useEffect(() => {
    if (responseTimer.current !== null) {
      window.clearTimeout(responseTimer.current);
      responseTimer.current = null;
    }
    setIsThinking(false);
    setMessages([{ id: 1, role: "assistant", text: copy.greeting }]);
    nextId.current = 2;

    return () => {
      if (responseTimer.current !== null) {
        window.clearTimeout(responseTimer.current);
        responseTimer.current = null;
      }
    };
  }, [copy.greeting]);

  const sendMessage = (text: string, showThinking = true) => {
    const message = text.trim();
    if (!message || isThinking) return;
    const response = answerFor(message, market);

    if (showThinking) {
      const userId = nextId.current++;
      const thinkingId = nextId.current++;
      setMessages((current) => [
        ...current,
        { id: userId, role: "user", text: message },
        { id: thinkingId, role: "assistant", text: "...", thinking: true },
      ]);
      setDraft("");
      setIsThinking(true);
      responseTimer.current = window.setTimeout(() => {
        setMessages((current) =>
          current.map((item) =>
            item.id === thinkingId ? { id: thinkingId, role: "assistant", ...response } : item,
          ),
        );
        responseTimer.current = null;
        setIsThinking(false);
      }, 800);
      return;
    }

    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "user", text: message },
      { id: nextId.current++, role: "assistant", ...response },
    ]);
    setDraft("");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}

      <button
        type="button"
        onClick={() => {
          resetForMarket();
          setOpen(true);
        }}
        className="support-fab tap-target fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-warning px-5 py-3 font-semibold text-warning-foreground shadow-lift transition hover:-translate-y-0.5 hover:bg-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:right-6"
        aria-label={copy.fab}
      >
        <MessageCircle aria-hidden className="size-5" />
        <span>{copy.fab}</span>
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="support-assistant-panel fixed z-50 flex flex-col overflow-hidden border border-border bg-card shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <header className="flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning text-warning-foreground">
                <Bot aria-hidden className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <DialogPrimitive.Title className="font-semibold">
                  {copy.title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-sm text-primary-foreground/75">
                  {copy.subtitle}
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close
                className="tap-target grid place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label={copy.close}
              >
                <X aria-hidden className="size-5" />
              </DialogPrimitive.Close>
            </header>

            <div
              className="flex-1 space-y-3 overflow-y-auto bg-background/70 p-4"
              aria-live="polite"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[86%] rounded-2xl rounded-br-sm bg-warning px-4 py-3 text-sm leading-relaxed text-warning-foreground"
                      : "max-w-[90%] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm"
                  }
                >
                  {message.thinking ? (
                    <span
                      role="status"
                      aria-label={market === "jp" ? "回答を準備しています" : "Preparing an answer"}
                      className="inline-flex min-h-5 items-center gap-1.5 px-1"
                    >
                      <span className="sr-only">...</span>
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          aria-hidden="true"
                          className="size-2 rounded-full bg-primary motion-safe:animate-bounce"
                          style={{ animationDelay: `${dot * 120}ms` }}
                        />
                      ))}
                    </span>
                  ) : (
                    <p>{message.text}</p>
                  )}
                  {message.to && message.linkLabel ? (
                    <Link
                      to={message.to as NonNullable<LinkProps["to"]>}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-flex font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {message.linkLabel} →
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="border-t border-border bg-card p-3">
              <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                {copy.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={isThinking}
                    className="shrink-0 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-warning hover:text-foreground disabled:cursor-wait disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <form onSubmit={onSubmit} className="flex gap-2">
                <label htmlFor="assistant-message" className="sr-only">
                  {copy.placeholder}
                </label>
                <input
                  id="assistant-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={isThinking}
                  placeholder={copy.placeholder}
                  className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-base text-foreground outline-none focus:border-primary sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={isThinking}
                  className="tap-target inline-flex items-center justify-center gap-2 rounded-xl bg-warning px-4 font-semibold text-warning-foreground transition hover:bg-primary disabled:cursor-wait disabled:opacity-60"
                  aria-label={copy.send}
                >
                  <Send aria-hidden className="size-4" />
                  <span className="hidden sm:inline">{copy.send}</span>
                </button>
              </form>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles aria-hidden className="size-3" />
                {market === "jp"
                  ? "製品ガイドに基づくクイックサポート"
                  : "Quick support based on published product guides"}
              </p>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </AssistantContext.Provider>
  );
}
