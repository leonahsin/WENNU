import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Callout } from "@/components/site/Callout";
import { ProductImage } from "@/components/site/ProductImage";
import { JpDraftNotice } from "@/components/site/JpDraftNotice";
import { CarriedContextNote } from "@/components/site/CarriedContextNote";

export const Route = createFileRoute("/jp/contact")({
  head: () => ({
    meta: [
      { title: "お問い合わせ | PCI01 サポート 日本" },
      {
        name: "description",
        content:
          "PCI01 ペット用体温計に関するお問い合わせの前に。セルフサポートのご確認と、ご依頼内容の整理についてご案内します。",
      },
      { property: "og:title", content: "お問い合わせ | PCI01 サポート 日本" },
      { property: "og:description", content: "お問い合わせ前のご確認とご準備。" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/jp/contact" },
      { property: "og:locale", content: "ja_JP" },
    ],
    links: [
      { rel: "canonical", href: "/jp/contact" },
      { rel: "alternate", hrefLang: "ja-JP", href: "/jp/contact" },
      { rel: "alternate", hrefLang: "en-US", href: "/contact" },
    ],
  }),
  component: JpContact,
});

function JpContact() {
  return (
    <div lang="ja">
      <PageHeader
        eyebrow="お問い合わせ"
        title="お問い合わせ"
        description="まずはセルフサポートをご確認ください。解決しない場合は、ご依頼内容の整理にお進みください。"
        crumbs={[{ label: "サポートホーム", to: "/jp" }, { label: "お問い合わせ" }]}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <CarriedContextNote market="jp" />
        </div>
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">お問い合わせの前に</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="surface-card p-4">
                <Link to="/jp/troubleshooting" className="font-semibold text-primary hover:underline">
                  トラブルシューティング
                </Link>
                で、症状に近い手順をご確認ください。
              </li>
              <li className="surface-card p-4">
                <Link to="/jp/faq" className="font-semibold text-primary hover:underline">
                  よくあるご質問
                </Link>
                を検索してご確認ください。
              </li>
              <li className="surface-card p-4">
                <Link to="/jp/support-request" className="font-semibold text-primary hover:underline">
                  サポートのご依頼内容を整理する
                </Link>
                で、必要な情報と写真をおまとめください。
              </li>
            </ul>
            <Callout tone="info" title="サポートでご案内できる範囲">
              <p>
                製品の使い方、設定、お手入れに関するご案内のみを行っております。診断や獣医療のご助言は行っておりません。健康に関するご相談は獣医師にお願いいたします。
              </p>
            </Callout>
          </div>
          <ProductImage
            view="front"
            alt="PCI01 ペット用体温計の正面。お問い合わせの際の製品特定にご利用ください。"
            caption="対象製品：PCI01 ペット用体温計"
            priority
          />
        </div>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold">日本市場の窓口情報</h2>
          <JpDraftNotice label="日本市場の受付窓口・電話／メール・受付時間・初回回答目安・所在地" />
          <p className="text-sm text-muted-foreground">
            日本向けの窓口が確定するまで、本ページから外部への送信は行われません。
          </p>
        </section>
      </main>
    </div>
  );
}
