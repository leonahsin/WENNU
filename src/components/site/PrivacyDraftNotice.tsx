import { ShieldAlert } from "lucide-react";
import { INTERNAL_PLACEHOLDER, JP_INTERNAL_PLACEHOLDER } from "@/content/market";

/**
 * Draft privacy notice. The wording below is a DRAFT for internal review and
 * must not be presented as approved policy. Retention duration, contact
 * channels and legal text are approval-required configuration.
 */
export function PrivacyDraftNotice({ locale }: { locale: "en-US" | "ja-JP" }) {
  const ja = locale === "ja-JP";
  return (
    <div className="space-y-3 rounded-xl border border-dashed border-warning/60 bg-warning-soft p-4">
      <p className="flex items-start gap-2 text-sm font-semibold text-foreground">
        <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
        {ja ? "個人情報の取り扱いについて" : "Privacy notice"}
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {ja ? (
          <>
            <li>
              ご入力内容と添付ファイルは、PCI01
              に関するお問い合わせ対応のためにのみ、非公開の環境に保存されます。
            </li>
            <li>添付ファイルは公開されません。担当者のみが一時的なリンクで確認します。</li>
            <li>現時点でメールなどの外部送信は行いません。</li>
            <li>保存期間・お問い合わせ窓口・法的表記：{JP_INTERNAL_PLACEHOLDER}</li>
          </>
        ) : (
          <>
            <li>
              Your answers and files are stored privately and used only to review this PCI01
              request.
            </li>
            <li>
              Attachments are never public. Support staff open them through short-lived private
              links.
            </li>
            <li>No email or external support channel is contacted at this stage.</li>
            <li>Retention duration, contact channels and legal text: {INTERNAL_PLACEHOLDER}</li>
          </>
        )}
      </ul>
      <p className="rounded-lg bg-card/70 p-3 text-sm font-medium text-foreground">
        {ja
          ? "パスワード、クレジットカード番号、マイナンバーや運転免許証などの公的な身分証明書番号、今回のご相談に関係のない医療・個人情報は入力しないでください。"
          : "Please do not include passwords, payment card details, government ID numbers, or medical or personal information unrelated to this request."}
      </p>
    </div>
  );
}
