import { useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BatteryMedium,
  ChevronDown,
  CircleHelp,
  Droplets,
  PawPrint,
  ScanLine,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HelpfulPrompt } from "@/components/site/HelpfulPrompt";
import { SearchField } from "@/components/site/SearchField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FAQ_LINKS } from "@/content/faqLinks";
import {
  JP_FAQ_ITEMS,
  JP_FAQ_PRINCIPLES,
  JP_TROUBLESHOOTING_CATEGORIES,
  JP_WONT_TURN_ON_STEPS,
} from "@/content/jp/support";
import type { MarketId } from "@/content/market";
import {
  FAQ_ITEMS,
  FAQ_PRINCIPLES,
  TROUBLESHOOTING_CATEGORIES,
  WONT_TURN_ON_STEPS,
} from "@/content/support";
import {
  VIDEO_CATEGORIES_US,
  VIDEO_CATEGORIES_JP,
  isPlayable,
  videosForMarket,
} from "@/content/videos";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL;
const supabaseKey = (import.meta.env as any).VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

type TopicId = "all" | "getting-started" | "how-to-use" | "cleaning-care" | "troubleshooting";
type EntryKind = "answer" | "cleaning" | "troubleshooting";

interface Topic {
  id: Exclude<TopicId, "all">;
  label: string;
  description: string;
  icon: LucideIcon;
  categories: string[];
}

interface Entry {
  id: string;
  anchors: string[];
  topic: Exclude<TopicId, "all">;
  category: string;
  title: string;
  summary?: string;
  answer?: string;
  steps?: ReadonlyArray<{ title?: string; body: string }> | undefined;
  warningTitle?: string;
  warningBody?: string;
  kind: EntryKind;
  linkId?: string;
}

const TOPICS: Record<MarketId, Topic[]> = Object.fromEntries(
  (["us", "jp"] as const).map((market) => {
    const jp = market === "jp";
    const categories = jp ? VIDEO_CATEGORIES_JP : VIDEO_CATEGORIES_US;
    return [
      market,
      [
        ...categories.map((category, index) => ({
          ...category,
          description: "",
          icon: [Sparkles, ScanLine, BatteryMedium][index]!,
          categories:
            index === 0
              ? ["getting-started", "Getting Started", "はじめに"]
              : index === 1
                ? [
                    "how-to-use",
                    "Measurement & Scanning",
                    "My Reading Looks Wrong",
                    "Understanding Temperature",
                    "Dogs & Cats",
                    "測定とスキャン",
                    "数値がおかしいと感じたら",
                    "体温について",
                    "犬と猫",
                  ]
                : ["cleaning-care", "Product & Care", "製品とお手入れ"],
        })),
        {
          id: "troubleshooting",
          label: jp ? "困ったとき" : "Troubleshooting",
          description: "",
          icon: Wrench,
          categories: ["troubleshooting", "Troubleshooting", "困ったとき"],
        },
      ],
    ];
  }),
) as Record<MarketId, Topic[]>;

const COPY = {
  us: {
    home: "PCI01 Support",
    homeTo: "/product/pci01",
    title: "FAQ",
    description: "Clear answers, care tips, and step-by-step fixes for your PCI01.",
    browse: "Browse by topic",
    all: "All questions",
    questions: "questions",
    safety: "Before you measure",
    safetyHint: "Four things worth knowing",
    cleaning: "How do I clean and care for PCI01?",
    cleaningLabel: "Cleaning & care",
    trouble: "Troubleshooting",
    related: "Related guides",
    video: "Video",
    step: "Step",
  },
  jp: {
    home: "PCI01 サポート",
    homeTo: "/jp/product/pci01",
    title: "FAQ",
    description: "PCI01 のよくあるご質問、お手入れ、症状別の確認手順をまとめました。",
    browse: "トピックから探す",
    all: "すべての質問",
    questions: "件",
    safety: "測定の前に",
    safetyHint: "大切な4つのポイント",
    cleaning: "PCI01 のお手入れと保管方法は？",
    cleaningLabel: "お手入れと保管",
    trouble: "困ったとき",
    related: "関連ガイド",
    video: "動画",
    step: "ステップ",
  },
} as const;

export function FaqPage({ market }: { market: MarketId }) {
 console.log("Vercel 現在真正連線的資料庫是：", (import.meta.env as any).VITE_SUPABASE_URL);
  const jp = market === "jp";
  const copy = COPY[market];
  const topics = TOPICS[market];
  
  // 預設先用舊資料墊檔
  const [faqItems, setFaqItems] = useState<any[]>(jp ? JP_FAQ_ITEMS : FAQ_ITEMS);

  useEffect(() => {
    const fetchFaqs = async () => {
      const currentLang = jp ? "jp" : "en";
      console.log(`[檢查點 1] 準備抓取語言：${currentLang}`);
      
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('language', currentLang);
      
      console.log("[檢查點 2] Supabase 回傳完整結果：", { data, error });

      if (error) {
        console.error("❌ 讀取 Supabase FAQ 失敗，原因：", error.message, error.details);
      } else if (data) {
        console.log(`✅ 成功連線！共抓到 ${data.length} 筆資料`);
        if (data.length > 0) {
          setFaqItems(data);
        } else {
          console.warn("⚠️ 連線成功，但資料庫裡是空的（0筆）！");
        }
      }
    };

    fetchFaqs();
  }, [jp]);
  

  const principles = jp ? JP_FAQ_PRINCIPLES : FAQ_PRINCIPLES;
  const troubleshooting = jp ? JP_TROUBLESHOOTING_CATEGORIES : TROUBLESHOOTING_CATEGORIES;
  const powerSteps = jp ? JP_WONT_TURN_ON_STEPS : WONT_TURN_ON_STEPS;
  const base = jp ? "/jp" : "";
  const routeHref = useRouterState({ select: (state) => state.location.href });
  const routeHash = useRouterState({ select: (state) => state.location.hash });
  const urlQuery = new URL(routeHref, "https://support.local").searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [topic, setTopic] = useState<TopicId>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const entries = useMemo<Entry[]>(() => {
    const topicFor = (category: string) =>
      topics.find((item) => item.categories.includes(category));

    return faqItems.map((item, index) => {
      const parent = topicFor(item.category) ?? topics[0]!;
      
      let parsedSteps: Array<{ title?: string; body: string }> | undefined = undefined;
      
      // 1. 清理換行符號
      let mainAnswer = item.answer ? item.answer.replace(/<br\s*\/?>/gi, '\n') : "";

      // 2. 強化判斷：是否包含英文的 Step 或日文的 ステップ
      if (mainAnswer && (mainAnswer.includes("Step") || mainAnswer.includes("ステップ"))) {
        
        // 3. 使用更寬鬆的正規表達式，捕捉各種全形/半形、有無冒號、有無空格的 ステップ
        // 這樣不管是 "ステップ 1:"、"ステップ1:" 還是 "ステップ１：" 都能抓到
        const parts = mainAnswer.split(/(?=Step\s*\d+\s*:|Step\s*\d+|ステップ\s*\d+\s*[:：]?|ステップ[０-９\d]+\s*[:：]?)/g);
        
        mainAnswer = parts[0]?.trim(); 
        
        parsedSteps = parts.slice(1).map((stepText: string) => {
          // 清除步驟標籤，留下乾淨的內文
          const cleanText = stepText.replace(/Step\s*\d+\s*:?|ステップ\s*[０-９\d]+\s*[:：]?/g, "").trim();
          
          // 如果內文中有換行，就把換行前當標題，換行後當步驟說明
          const firstNewLine = cleanText.indexOf("\n");
          if (firstNewLine > 0 && firstNewLine < 50) {
            return {
              title: cleanText.substring(0, firstNewLine).trim(),
              body: cleanText.substring(firstNewLine).trim(),
            };
          }
          return { body: cleanText };
        });
      }

      return {
        id: `faq-${item.id || index}`,
        anchors: [`faq-${item.id || index}`],
        topic: parent.id,
        category: parent.label,
        title: item.question,
        answer: mainAnswer,
        steps: parsedSteps,
        kind: "answer",
        linkId: item.id,
      };
    });
  }, [faqItems, topics]);

  const searchText = query.trim().toLocaleLowerCase();
  const matching = entries.filter(
    (entry) =>
      !searchText ||
      [
        entry.title,
        entry.answer,
        entry.summary,
        entry.category,
        ...(entry.steps?.map((step) => `${step.title ?? ""} ${step.body}`) ?? []),
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(searchText),
  );
  const visible = matching.filter((entry) => topic === "all" || entry.topic === topic);
  const count = (id: TopicId) =>
    matching.filter((entry) => id === "all" || entry.topic === id).length;
  const changeTopic = (value: string) => {
    setTopic(value as TopicId);
    setOpenId(null);
  };

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);
  useEffect(() => {
    const hash = routeHash.replace(/^#/, "");
    if (!hash) return;
    const entry = entries.find((item) => item.anchors.includes(hash));
    if (!entry) return;
    setQuery("");
    setTopic(entry.topic);
    setOpenId(entry.id);
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(`faq-button-${entry.id}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [entries, routeHash]);

  return (
    <main lang={jp ? "ja" : "en"} className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <nav
        aria-label={jp ? "パンくずリスト" : "Breadcrumb"}
        className="mb-4 text-sm text-muted-foreground"
      >
        <a href={copy.homeTo} className="text-primary hover:underline">
          {copy.home}
        </a>
        <span aria-hidden> › </span>
        <span>FAQ</span>
      </nav>
      <div className="mb-5">
        <h1 className="text-3xl font-bold sm:text-4xl">FAQ</h1>
      </div>
      <SearchField
        id="faq-search"
        label={jp ? "質問や症状を検索" : "Search questions or symptoms"}
        placeholder={jp ? "電池、測定値、お手入れなど" : "Try battery, readings or cleaning"}
        value={query}
        onChange={setQuery}
        {...(searchText
          ? { hint: jp ? `${visible.length} 件の結果` : `${visible.length} results` }
          : {})}
      />
      <details className="group my-4 rounded-xl border border-primary/15 bg-secondary/45 px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold marker:hidden">
          <PawPrint aria-hidden className="size-4 shrink-0 text-primary" />
          <span className="flex-1">
            {copy.safety}
            <span className="font-normal text-muted-foreground"> — {copy.safetyHint}</span>
          </span>
          <ChevronDown
            aria-hidden
            className="size-4 shrink-0 transition-transform group-open:rotate-180"
          />
        </summary>
        <ul className="mt-4 grid gap-3 border-t border-primary/10 pt-4 sm:grid-cols-2">
          {principles.map((line, index) => (
            <li key={line} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                 {index + 1}
              </span>
              <span>{line}</span>
            </li>
        ))}
        </ul>
      </details>
      <div className="grid items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <nav aria-label={copy.browse} className="lg:sticky lg:top-24">
          <h2 className="mb-2 text-sm font-semibold" id="faq-category-label">
            {copy.browse}
          </h2>
          <div className="lg:hidden">
            <Select value={topic} onValueChange={changeTopic}>
              <SelectTrigger
                aria-labelledby="faq-category-label"
                className="min-h-11 w-full bg-card"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {copy.all} ({count("all")})
                </SelectItem>
                {topics.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label} ({count(item.id)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden space-y-2 lg:block">
            <TopicButton
              active={topic === "all"}
              label={copy.all}
              description=""
              count={count("all")}
              icon={CircleHelp}
              onClick={() => changeTopic("all")}
            />
            {topics.map((item) => (
              <TopicButton
                key={item.id}
                active={topic === item.id}
                label={item.label}
                description=""
                count={count(item.id)}
                icon={item.icon}
                onClick={() => changeTopic(item.id)}
              />
            ))}
          </div>
        </nav>
        <div className="flex min-w-0 flex-col gap-7">
          {!visible.length ? (
            <div role="status" className="rounded-2xl border border-border p-5">
              <p>{jp ? "該当する質問が見つかりませんでした。" : "No matching questions found."}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {jp
                  ? "別のキーワードを試すか、すべての質問をご覧ください。"
                  : "Try another keyword or browse all questions."}
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="font-semibold text-primary underline"
                  onClick={() => {
                    setQuery("");
                    setTopic("all");
                  }}
                >
                  {copy.all}
                </button>
                <a
                  className="font-semibold text-primary underline"
                  href={`${base}/support-request`}
                >
                  {jp ? "サポートに相談" : "Contact Support"}
                </a>
              </div>
            </div>
          ) : null}
          <div className="space-y-7">
            {topics.map((group) => {
              const items = visible.filter((entry) => entry.topic === group.id);
              if (!items.length) return null;
              return (
                <section key={group.id} aria-labelledby={`group-${group.id}`}>
                  <h2
                    id={`group-${group.id}`}
                    className="mb-3 flex items-center gap-3 text-lg font-bold"
                  >
                    <group.icon aria-hidden className="size-5 text-primary" />
                    {group.label}
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-sm text-primary">
                      {items.length}
                    </span>
                  </h2>
                  <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    {items.map((entry, index) => (
                      <FaqEntry
                        key={entry.id}
                        entry={entry}
                        divided={index > 0}
                        expanded={openId === entry.id}
                        onToggle={() => setOpenId(openId === entry.id ? null : entry.id)}
                        market={market}
                        base={base}
                        copy={copy}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-4">
        <HelpfulPrompt market={market} contextLabel="PCI01 FAQ" issueCategory="FAQ" />
      </div>
    </main>
  );
}

function TopicButton({
  active,
  label,
  description,
  count,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  count: number;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex min-w-[13.5rem] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition lg:w-full lg:min-w-0 ${active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card hover:border-primary/40 hover:bg-secondary/55"}`}
    >
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-xl ${active ? "bg-white/15" : "bg-secondary text-primary"}`}
      >
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {description ? (
          <span
            className={`mt-0.5 hidden text-xs lg:block ${active ? "text-primary-foreground/75" : "text-muted-foreground"}`}
          >
            {description}
          </span>
        ) : null}
      </span>
      <span
        className={`text-xs font-semibold ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}
      >
        {count}
      </span>
    </button>
  );
}

function FaqEntry({
  entry,
  divided,
  expanded,
  onToggle,
  market,
  base,
  copy,
}: {
  entry: Entry;
  divided: boolean;
  expanded: boolean;
  onToggle: () => void;
  market: MarketId;
  base: string;
  copy: (typeof COPY)[MarketId];
}) {
  const Icon =
    entry.kind === "cleaning" ? Droplets : entry.kind === "troubleshooting" ? Wrench : CircleHelp;
  const videos = videosForMarket(market);
  const links = entry.linkId ? FAQ_LINKS[entry.linkId] : undefined;
  const video = links?.videoBaseId
    ? videos.find((item) => item.baseId === links.videoBaseId && isPlayable(item))
    : undefined;
  return (
    <li id={entry.anchors[0]} className={`scroll-mt-24 ${divided ? "border-t border-border" : ""}`}>
      {entry.anchors.slice(1).map((anchor) => (
        <span key={anchor} id={anchor} className="scroll-mt-24" />
      ))}
      <h3>
        <button
          id={`faq-button-${entry.id}`}
          type="button"
          aria-expanded={expanded}
          aria-controls={`faq-panel-${entry.id}`}
          onClick={onToggle}
          className="tap-target flex w-full items-start gap-3 px-5 py-5 text-left sm:px-6"
        >
          <span
            className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${entry.kind === "troubleshooting" ? "bg-warning/15 text-warning" : "bg-secondary text-primary"}`}
          >
            <Icon aria-hidden className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-primary">
              {entry.category}
            </span>
            <span className="mt-1 block text-base font-semibold sm:text-lg">{entry.title}</span>
            {!expanded && entry.summary ? (
              <span className="mt-1 line-clamp-1 block text-sm font-normal text-muted-foreground">
                {entry.summary}
              </span>
            ) : null}
          </span>
          <ChevronDown
            aria-hidden
            className={`mt-2 size-5 shrink-0 text-primary transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div
        id={`faq-panel-${entry.id}`}
        role="region"
        aria-labelledby={`faq-button-${entry.id}`}
        hidden={!expanded}
        className="border-t border-border bg-secondary/20 px-5 py-5 sm:px-6 sm:pl-[5.25rem]"
      >
        {entry.answer ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{entry.answer}</p>
        ) : null}
        {entry.steps?.length ? (
          <ol className="mt-5 space-y-4">
            {entry.steps.map((step, index) => (
              <li
                key={`${entry.id}-${index}`}
                className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span>
                  <span className="sr-only">
                    {copy.step} {index + 1}:{" "}
                  </span>
                  {step.title ? (
                    <strong className="block text-foreground">{step.title}</strong>
                  ) : null}
                  {step.body}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
        {video ? (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {copy.related}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a
                href={`${base}/videos#${video.anchor}`}
                className="font-semibold text-primary hover:underline"
              >
                {copy.video}: {video.title}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </li>
  );
}