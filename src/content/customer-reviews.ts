// Source: 20260914_美國Amazon_VINE評論_更新版.xlsx, worksheet「評論」.
// sourceRow points to the original English text in column C and rating in F.
// These are selected summaries, not verbatim quotations or an overall rating.
export const customerReviews = [
  {
    who: "Mandyvoll",
    rating: 5,
    sourceRow: 3,
    en: "Appreciated the memory feature for comparing readings over time, and said their cat enjoyed fur mode. Initial setup took some figuring out.",
    jp: "記録を保存して日々の数値を比べられる点を評価。猫も被毛モードを気に入ったそうです。初期設定には少し試行錯誤が必要でした。",
  },
  {
    who: "Karen Marie",
    rating: 5,
    sourceRow: 6,
    en: "Liked the build quality, included batteries, and memory settings. The printed directions could be clearer, but the linked how-to videos were very helpful.",
    jp: "作りの良さ、電池の付属、記録機能を評価。説明書には改善の余地があるものの、案内された使い方動画がとても役立ったそうです。",
  },
  {
    who: "Mom of teens2",
    rating: 5,
    sourceRow: 17,
    en: "Found the non-invasive approach simple and less of a hassle. Although the price felt a little high, they would pay it again for the convenience.",
    jp: "非侵襲的な測定方法はシンプルで手間が少ないと感じたそうです。価格はやや高めでも、この使いやすさならまた購入したいとのこと。",
  },
  {
    who: "Roxx Reviews",
    rating: 5,
    sourceRow: 18,
    en: "Highlighted gentle fur scanning and flexible measurement modes. Separate temperature histories for dogs and cats made it easier to keep track without writing readings down.",
    jp: "やさしく被毛をとかして測る方法と、複数の測定モードを評価。犬と猫の履歴を別々に保存でき、手書きの記録が不要な点も好評でした。",
  },
  {
    who: "E",
    rating: 5,
    sourceRow: 29,
    en: "Found the thermometer easy to use and liked the dog and cat settings. Emphasized using it for monitoring, alongside veterinary care when a pet seems unwell.",
    jp: "使いやすさと犬・猫それぞれの設定を評価。日々の確認に役立てつつ、ペットの具合が悪そうなときは獣医師に相談することも大切だと述べています。",
  },
  {
    who: "Kim Berns",
    rating: 5,
    sourceRow: 36,
    en: "Found the printed instructions hard to follow, but Amazon's videos helped. Described a nicely made product that became fairly easy to use with practice and pet cooperation.",
    jp: "説明書はわかりにくかったものの、Amazonの動画が役立ったそうです。作りが良く、使い方に慣れ、ペットが協力してくれれば比較的使いやすいと評価しています。",
  },
  {
    who: "Nancy",
    rating: 5,
    sourceRow: 37,
    en: "The videos helped resolve initial setup difficulties. Tried it on three pets without issues and found continuous scanning easy, with readings appearing quickly.",
    jp: "最初は操作に戸惑いましたが、動画を見て解決。3匹で問題なく試せて、連続測定モードは操作しやすく、数値の表示も速かったそうです。",
  },
] as const;
