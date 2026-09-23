import { useRouterState } from "@tanstack/react-router";
import { troubleshootingPrefill } from "@/lib/faqTroubleshooting";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Wrench } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { PrivacyDraftNotice } from "@/components/site/PrivacyDraftNotice";
import { Field, controlClass } from "@/components/support-request/fields";
import type { MarketId } from "@/content/market";
import { makeSubmissionKey, PRIVACY_CONSENT_VERSION } from "@/lib/caseIntake";
import { submitSupportCase } from "@/lib/supportCases.functions";

import { requestAttempt, validateBriefRequest } from "@/lib/briefRequest";
import type { BriefRequest, RequestErrors, RequestField } from "@/lib/briefRequest";

// 1. 載入 Supabase 套件與連線設定
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL;
const supabaseKey = (import.meta.env as any).VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const STATUS_COPY = {
  us: {
    errorsTitle: (count: number) =>
      `${count} ${count === 1 ? "field needs" : "fields need"} your attention`,
    errorsHint: "Choose a field below to fix it. Everything you entered is still here.",
    errors: {
      topic: "Choose a product issue.",
      order: "Enter your Amazon order number (up to 60 characters).",
      date: "Enter a valid purchase date (YYYY-MM-DD).",
      details: "Describe the issue in 10–1,500 characters.",
      email: "Enter a valid email address.",
      privacy: "Please read and agree to the privacy notice before sending.",
    },
    privacyLabel: "Privacy consent",
    failed: "We couldn't confirm your submission",
    failedBody: "Your entries are still here. Try again, or download your details and email us.",
    limited: "Too many requests. Please try again later or contact us by email.",
    invalid: "Please review your entries and try again, or email us your details.",
    retry: "Try again",
    download: "Download my details",
    emailUs: "Contact us by email",
    emailHint:
      "Opens your email app. Attach the downloaded file or paste your details before sending.",
    reference: "Case reference",
    reply: "Reply email",
    timing: "Response time",
    timingBody: "We will reply within 24-48 hours. Keep your case reference for follow-up.", // ✅ 已修改
    confirmation: "Confirmation email",
    confirmationBody:
      "A confirmation email has been sent to your address. Save your case reference here.", // ✅ 已修改
    next: "What happens next?",
    nextItems: [
      "Our team will review the details you submitted.",
      "We may ask for product photos or proof of purchase.",
      "Include your case reference when following up.",
    ],
    overview: "Back to PCI01 Support",
    faq: "Continue to FAQ",
    saved: "Your request has been saved.",
  },
  jp: {
    errorsTitle: (count: number) => `${count}項目をご確認ください`,
    errorsHint: "項目を選ぶと該当する入力欄に移動します。入力内容はすべて保持されています。",
    errors: {
      topic: "製品の症状を選択してください。",
      order: "Amazon 注文番号を60文字以内で入力してください。",
      date: "正しい購入日を入力してください（YYYY-MM-DD）。",
      details: "症状を10〜1,500文字で入力してください。",
      email: "正しいメールアドレスを入力してください。",
      privacy: "個人情報の取り扱いをご確認のうえ、同意してください。",
    },
    privacyLabel: "個人情報の取り扱いへの同意",
    failed: "送信完了を確認できませんでした",
    failedBody:
      "入力内容は保持されています。再送信するか、内容をダウンロードしてメールでお問い合わせください。",
    limited:
      "送信回数が多いため、しばらくしてから再度お試しいただくか、メールでお問い合わせください。",
    invalid: "入力内容をご確認のうえ再送信するか、メールで内容をお知らせください。",
    retry: "再送信する",
    download: "入力内容をダウンロード",
    emailUs: "メールで問い合わせる",
    emailHint:
      "メールアプリが開きます。ダウンロードしたファイルを添付するか、入力内容を貼り付けて送信してください。",
    reference: "受付番号",
    reply: "返信先",
    timing: "返信時期",
    timingBody: "24〜48時間以内にご返信いたします。お問い合わせ用に受付番号をお控えください。", // ✅ 已修改
    confirmation: "確認メール",
    confirmationBody: "ご入力いただいたアドレスに確認メールを送信しました。この画面の受付番号もお控えください。", // ✅ 已修改
    next: "今後の流れ",
    nextItems: [
      "担当者がご依頼の内容を確認します。",
      "製品の写真や購入証明をお願いする場合があります。",
      "追加のお問い合わせには受付番号を添えてください。",
    ],
    overview: "PCI01 サポートに戻る",
    faq: "FAQ を見る",
    saved: "ご依頼を保存しました。",
  },
} as const;

const COPY = {
  us: {
    home: "Support Home",
    title: "Support Request",
    description:
      "Tell us the essentials about your PCI01 product issue. If we need a photo, video or serial number, our support team will ask for it later.",
    formTitle: "Tell us what happened",
    formHint: "A short description is enough to get your request started.",
    order: "Amazon Order Number",
    date: "Purchase date",
    purchaseHint: "Required for warranty or replacement review.",
    topic: "Product issue",
    topicPlaceholder: "Select the closest match",
    topics: [
      "Setup and first use",
      "Power and battery",
      "Screen and backlight",
      "Measurement consistency",
      "Silicone cover and cleaning",
      "Stored records",
      "Product warranty or replacement",
      "Something else",
    ],
    details: "What happened?",
    detailsHint:
      "Describe the product symptom and anything you have already tried. Please do not include medical or payment information.",
    email: "Email for our reply",
    privacy:
      "I have read the privacy notice and agree that this information may be used to review my request.",
    submit: "Send support request",
    sending: "Sending…",
    required: "Please complete all required fields.",
    emailError: "Enter a valid email address.",
    submitError: "Your request could not be saved. Please try again.",
    received: "Support request received",
    receivedBody:
      "Our team will review your PCI01 product issue. Keep this reference for any follow-up:",
  },
  jp: {
    home: "サポートホーム",
    title: "サポート依頼",
    description:
      "PCI01 製品の症状について、まず必要な情報だけをご入力ください。写真・動画・製造番号が必要な場合は、担当者から後ほどご案内します。",
    formTitle: "製品の症状をお知らせください",
    formHint: "簡単なご説明だけでサポート依頼を始められます。",
    order: "Amazon 注文番号",
    date: "購入日",
    purchaseHint: "保証・交換の確認に必要です。",
    topic: "製品の症状",
    topicPlaceholder: "もっとも近い項目を選択",
    topics: [
      "初期設定・はじめての使用",
      "電源・電池",
      "画面・バックライト",
      "測定値のばらつき",
      "シリコンカバー・お手入れ",
      "保存された測定値",
      "製品保証・交換",
      "その他",
    ],
    details: "どのような症状ですか？",
    detailsHint:
      "製品の症状と、すでにお試しいただいた内容をご記入ください。医療情報や決済情報は入力しないでください。",
    email: "返信先メールアドレス",
    privacy: "個人情報の取り扱いに関するご案内を読み、依頼内容の確認に使用されることに同意します。",
    submit: "サポート依頼を送信",
    sending: "送信中…",
    required: "必須項目をご入力ください。",
    emailError: "正しいメールアドレスをご入力ください。",
    submitError: "依頼を保存できませんでした。もう一度お試しください。",
    received: "サポート依頼を受け付けました",
    receivedBody:
      "PCI01 製品の症状を確認します。お問い合わせの際は、次の受付番号をお知らせください。",
  },
} as const;

export function SimpleSupportRequest({ market }: { market: MarketId }) {
  const copy = COPY[market];
  const jp = market === "jp";
  const statusCopy = STATUS_COPY[market];
  const base = jp ? "/jp" : "";
  const send = useServerFn(submitSupportCase);
  const routeHref = useRouterState({ select: (state) => state.location.href });
  const [prefill] = useState(() =>
    troubleshootingPrefill(market, new URL(routeHref, "https://support.local").searchParams),
  );
  const [form, setForm] = useState<BriefRequest>({
    order: "",
    date: "",
    topic: prefill?.topic ?? "",
    details: prefill?.details ?? "",
    email: "",
    privacy: false,
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RequestErrors>({});
  const [validated, setValidated] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const attemptRef = useRef<{ payload: string; key: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState("");
  const warrantyTopic = jp ? "製品保証・交換" : "Product warranty or replacement";
  const needsPurchaseInfo = form.topic === warrantyTopic;

  const focusField = (id: string) => {
    const field = document.getElementById(id);
    field?.focus({ preventScroll: true });
    field?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const update = (patch: Partial<BriefRequest>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (validated) setFieldErrors(validateBriefRequest(next, next.topic === warrantyTopic));
  };
  const inputProps = (id: RequestField) => ({
    disabled: sending,
    required: true,
    "aria-invalid": !!fieldErrors[id],
    "aria-describedby":
      [fieldErrors[id] ? `${id}-error` : "", id === "details" || id === "order" ? `${id}-hint` : ""]
        .filter(Boolean)
        .join(" ") || undefined,
    className: `${controlClass} scroll-mt-24 ${fieldErrors[id] ? "border-warning ring-1 ring-warning/40" : ""}`,
  });
  const errorText = (id: RequestField) =>
    fieldErrors[id] ? statusCopy.errors[fieldErrors[id]!] : undefined;
  const errorFields = Object.keys(fieldErrors) as RequestField[];
  const fieldLabel = (id: RequestField) => (id === "privacy" ? statusCopy.privacyLabel : copy[id]);
  useEffect(() => {
    if (reference || error) {
      outcomeRef.current?.focus({ preventScroll: true });
      outcomeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [reference, error]);

  const downloadDetails = () => {
    const text = [
      "PCI01 — " + copy.title,
      ...(reference ? [statusCopy.reference + ": " + reference] : []),
      ...(["topic", "order", "date", "email", "details"] as const).map(
        (id) => `${copy[id]}: ${form[id]}`,
      ),
    ].join("\n\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `PCI01-support-request-${market}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const submit = async () => {
    if (sendingRef.current) return;
    
    // 檢查欄位有沒有填錯
    const errors = validateBriefRequest(form, needsPurchaseInfo);
    setValidated(true);
    setFieldErrors(errors);
    setError("");
    
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => {
        summaryRef.current?.focus({ preventScroll: true });
        summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    
    sendingRef.current = true;
    setSending(true);
    
    try {
      // 1. 呼叫 Supabase 將資料寫入 support_requests 資料表
      const { error: insertError } = await supabase
        .from('support_requests')
        .insert([
          {
            issue_type: form.topic,
            description: form.details.trim(),
            email: form.email.trim()
          }
        ]);

      if (insertError) {
        console.error("Supabase 寫入失敗:", insertError);
        setError(statusCopy.failedBody);
      } else {
        // 2. 送出成功！隨機產生一個受付編號給顧客看
        const fakeRef = "REQ-" + Math.floor(100000 + Math.random() * 900000);
        setReference(fakeRef);

        // 3. 直接把資料打包丟給 Make.com 發送信件
        try {
          
          await fetch("https://hook.eu1.make.com/fcb5k2daxy3wt764yy66y87bje8q6tog", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              issue_type: form.topic,
              description: form.details.trim(),
              email: form.email.trim(),
              reference: fakeRef,
              market: market
            }),
          });
        } catch (webhookError) {
          console.error("通知 Make.com 失敗，但不影響表單送出:", webhookError);
        }
      }
    } catch (err) {
      console.error("系統發生錯誤:", err);
      setError(statusCopy.failedBody);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: copy.home, to: jp ? "/jp" : "/" }, { label: copy.title }]}
        title={reference ? copy.received : copy.title}
        description={reference ? copy.receivedBody : copy.description}
      />
      <main lang={jp ? "ja" : undefined} className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        {reference ? (
          <div
            ref={outcomeRef}
            tabIndex={-1}
            role="status"
            aria-labelledby="request-success"
            className="scroll-mt-24 rounded-3xl border border-primary/20 bg-secondary/45 p-5 sm:p-7"
          >
            <CheckCircle2 aria-hidden className="size-10 text-primary" />
            <h2 id="request-success" className="mt-3 text-xl font-bold">
              {copy.received}
            </h2>
            <p className="mt-2">{statusCopy.saved}</p>
            <dl className="mt-5 grid gap-4 rounded-xl border border-primary/20 bg-card p-4">
              {[
                [statusCopy.reference, reference],
                [statusCopy.reply, form.email],
                [statusCopy.timing, statusCopy.timingBody],
                [statusCopy.confirmation, statusCopy.confirmationBody],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="min-w-0 break-words font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-5 font-bold">{statusCopy.next}</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              {statusCopy.nextItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`${base}/product/pci01`}
                className="tap-target rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
              >
                {statusCopy.overview}
              </a>
              <a
                href={`${base}/faq`}
                className="tap-target rounded-xl border border-primary/30 px-4 py-3 text-sm font-semibold"
              >
                {statusCopy.faq}
              </a>
              <button
                type="button"
                onClick={downloadDetails}
                className="tap-target rounded-xl border border-primary/30 px-4 py-3 text-sm font-semibold"
              >
                {statusCopy.download}
              </button>
            </div>
          </div>
        ) : (
          <section aria-labelledby="brief-request">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                <Wrench aria-hidden className="size-5" />
              </span>
              <div>
                <h2 id="brief-request" className="text-2xl font-bold">
                  {copy.formTitle}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{copy.formHint}</p>
              </div>
            </div>

            <form
              className="surface-card grid gap-5 p-5 sm:grid-cols-2 sm:p-7"
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
              noValidate
              aria-busy={sending}
            >
              {errorFields.length ? (
                <div
                  ref={summaryRef}
                  tabIndex={-1}
                  role="alert"
                  aria-labelledby="request-errors"
                  className="scroll-mt-24 rounded-xl border border-warning/50 bg-warning/10 p-4 sm:col-span-2"
                >
                  <h3 id="request-errors" className="font-bold">
                    {statusCopy.errorsTitle(errorFields.length)}
                  </h3>
                  <p className="mt-1 text-sm">{statusCopy.errorsHint}</p>
                  <ul className="mt-2 list-disc pl-5">
                    {errorFields.map((id) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          onClick={(event) => {
                            event.preventDefault();
                            focusField(id);
                          }}
                          className="inline-block py-2 font-semibold underline"
                        >
                          {fieldLabel(id)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {error ? (
                <div
                  ref={outcomeRef}
                  tabIndex={-1}
                  role="alert"
                  aria-labelledby="request-failure"
                  className="scroll-mt-24 rounded-xl border border-warning/50 bg-warning/10 p-4 sm:col-span-2"
                >
                  <h3 id="request-failure" className="font-bold">
                    {statusCopy.failed}
                  </h3>
                  <p className="mt-2">{error}</p>
                  {error !== statusCopy.failedBody ? (
                    <p className="mt-2">{statusCopy.failedBody}</p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                        <button
                      type="submit"
                      disabled={sending}
                      className="tap-target rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
                    >
                      {sending ? copy.sending : statusCopy.retry}
                    </button>
                    <button
                      type="button"
                      onClick={downloadDetails}
                      className="tap-target rounded-xl border border-primary/30 bg-card px-4 py-3 text-sm font-semibold"
                    >
                      {statusCopy.download}
                    </button>
                    <a
                      href={`mailto:service@techncare.jp?subject=${encodeURIComponent("PCI01 — " + copy.title)}`}
                      className="tap-target rounded-xl border border-primary/30 bg-card px-4 py-3 text-sm font-semibold"
                    >
                      {statusCopy.emailUs}
                    </a>
                  </div>
                  <p className="mt-3 break-words text-sm">service@techncare.jp</p>
                  <p className="mt-1 text-sm text-muted-foreground">{statusCopy.emailHint}</p>
                </div>
              ) : null}
              <div className="sm:col-span-2">
                <Field id="topic" label={copy.topic} error={errorText("topic")} required>
                  <select
                    id="topic"
                    {...inputProps("topic")}
                    value={form.topic}
                    onChange={(event) => update({ topic: event.target.value })}
                  >
                    <option value="">{copy.topicPlaceholder}</option>
                    {copy.topics.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
              </div>
              {needsPurchaseInfo ? (
                <>
                  <Field id="order" label={copy.order} error={errorText("order")} required>
                    <input
                      id="order"
                      {...inputProps("order")}
                      value={form.order}
                      onChange={(event) => update({ order: event.target.value })}
                    />
                    <p id="order-hint" className="mt-1.5 text-sm text-muted-foreground">
                      {copy.purchaseHint}
                    </p>
                  </Field>
                  <Field id="date" label={copy.date} error={errorText("date")} required>
                    <input
                      id="date"
                      type="date"
                      {...inputProps("date")}
                      value={form.date}
                      onChange={(event) => update({ date: event.target.value })}
                    />
                  </Field>
                </>
              ) : null}
              <div className="sm:col-span-2">
                <Field id="details" label={copy.details} error={errorText("details")} required>
                  <textarea
                    id="details"
                    rows={5}
                    {...inputProps("details")}
                    value={form.details}
                    onChange={(event) => update({ details: event.target.value })}
                  />
                  <p id="details-hint" className="mt-1.5 text-sm text-muted-foreground">
                    {copy.detailsHint}
                  </p>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="email" label={copy.email} error={errorText("email")} required>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...inputProps("email")}
                    value={form.email}
                    onChange={(event) => update({ email: event.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <PrivacyDraftNotice locale={jp ? "ja-JP" : "en-US"} />
                <label className="mt-4 flex items-start gap-3 text-sm">
                  <input
                    id="privacy"
                    type="checkbox"
                    required
                    disabled={sending}
                    aria-invalid={!!fieldErrors.privacy}
                    aria-describedby={fieldErrors.privacy ? "privacy-error" : undefined}
                    className="mt-1 size-4 accent-primary"
                    checked={form.privacy}
                    onChange={(event) => update({ privacy: event.target.checked })}
                  />
                  <span>{copy.privacy}</span>
                </label>
                {fieldErrors.privacy ? (
                  <p id="privacy-error" className="mt-2 text-sm font-medium text-warning">
                    {errorText("privacy")}
                  </p>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="tap-target rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
                >
                  {sending ? copy.sending : copy.submit}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </>
  );
}