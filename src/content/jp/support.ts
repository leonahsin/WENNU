/**
 * Japanese support content (Japan market only).
 *
 * U.S.-specific functions, thresholds, included items, contact channels,
 * warranty periods, return windows, fees, purchase channels, addresses and
 * response times are deliberately NOT reused here.
 */

export interface JpSupportTopic {
  id: string;
  title: string;
  description: string;
  to: string;
  keywords: string[];
}

export const JP_SUPPORT_TOPICS: JpSupportTopic[] = [
  {
    id: "product-support",
    title: "PCI01 製品サポート",
    description:
      "初期設定、犬用・猫用の使い方ガイド、ブルーのシリコンカバーを付けた状態と外した状態での使い方をご案内します。",
    to: "/jp/product/pci01",
    keywords: ["PCI01", "製品", "本体", "犬", "猫", "ガイド", "シリコン", "カバー", "電池"],
  },
  {
    id: "getting-started",
    title: "はじめてお使いになる方へ",
    description:
      "単4形1.5V乾電池2本の入れ方、使い方ガイドの選び方、最初の測定手順をご確認いただけます。",
    to: "/jp/getting-started",
    keywords: ["はじめて", "初期設定", "電池", "単4", "測定", "使い方"],
  },
  {
    id: "troubleshooting",
    title: "FAQ・トラブル解決",
    description:
      "電源が入らない、画面やバックライト、測定値のばらつき、カバー、お手入れ、保存件数についての手順をご案内します。",
    to: "/jp/faq#troubleshooting",
    keywords: ["困った", "電源", "画面", "バックライト", "ばらつき", "記録", "オレンジ"],
  },
  {
    id: "contact",
    title: "お問い合わせ",
    description:
      "まずはセルフサポートをご確認いただき、その後ご相談内容の整理にお進みください。窓口情報は確認中です。",
    to: "/jp/contact",
    keywords: ["問い合わせ", "連絡", "窓口", "サポート", "相談"],
  },
  {
    id: "faq",
    title: "よくあるご質問",
    description: "PCI01 についてよくいただくご質問を検索してご確認いただけます。",
    to: "/jp/faq",
    keywords: ["FAQ", "よくある質問", "質問", "回答"],
  },
];

export interface JpTroubleshootingCategory {
  id: string;
  title: string;
  description: string;
  symptoms: string[];
  to?: string;
  steps?: string[];
  needsJpConfirmation?: boolean;
}

export const JP_TROUBLESHOOTING_CATEGORIES: JpTroubleshootingCategory[] = [
  {
    id: "wont-turn-on",
    title: "電源が入らない",
    description: "電源ボタンを押しても反応がない場合の手順です。",
    symptoms: ["電源", "つかない", "入らない", "反応がない", "ボタン"],
    to: "/jp/troubleshooting/wont-turn-on",
  },
  {
    id: "screen-backlight",
    title: "画面とバックライト",
    description: "表示が暗い、見えにくい、測定中に色が変わった場合のご確認事項です。",
    symptoms: ["画面", "表示", "バックライト", "オレンジ", "暗い", "色"],
    steps: [
      "ブルーのシリコンカバーの縁が表示部分にかかっていないかご確認ください。",
      "明るさが均一な場所で、正面から表示をご覧ください。表示が暗い場合は電池残量が少ないことがあります。",
      "表示が薄いままの場合は、単4形1.5V乾電池2本を新しい同じ種類のものに交換してください。",
      "オレンジ色のバックライトは、測定値に注意を向けるための表示です。診断ではありません。複数回測定し、健康上のご心配は獣医師にご相談ください。",
    ],
  },
  {
    id: "inconsistent-measurements",
    title: "測定値がばらつく",
    description: "測定するたびに数値が大きく変わる場合のご確認事項です。",
    symptoms: ["ばらつき", "違う", "measurement", "測定", "数値"],
    steps: [
      "1回の測定は、途中で離さず続けて当ててください。",
      "1回だけの測定に頼らず、複数回測定して見比べてください。",
      "犬用・猫用ガイドに記載の位置と距離を、毎回同じにそろえてください。",
      "室温が安定した室内で、ペットが落ち着いてから測定してください。",
      "シリコン製の測定先端とコームの歯が清潔で乾いていること、カバーが正しく装着されていることをご確認ください。",
    ],
  },
  {
    id: "silicone-cover",
    title: "ブルーのシリコンカバー",
    description: "カバーが緩む、装着しにくい、裏ぶたを開けにくい場合のご確認事項です。",
    symptoms: ["シリコン", "カバー", "ブルー", "緩い", "装着", "裏ぶた"],
    steps: [
      "裏ぶたを開ける前に、必ずブルーのシリコンカバーを取り外してください。",
      "中央から引っ張らず、端から少しずつめくるように外してください。",
      "取り付けるときは先端の開口部から位置を合わせ、本体にゆっくりかぶせてください。",
      "カバーが表示部分や電源ボタンにかかっていないかご確認ください。",
    ],
  },
  {
    id: "cleaning",
    title: "お手入れ",
    description: "水で洗える部分と、水に濡らしてはいけない本体のご確認です。",
    symptoms: ["洗う", "洗浄", "水", "拭く", "衛生", "汚れ"],
    to: "/jp/faq#cleaning-care",
  },
  {
    id: "stored-records",
    title: "保存された測定値",
    description: "記録が見当たらない、保存件数の上限に達した場合のご確認事項です。",
    symptoms: ["記録", "履歴", "保存", "30件", "メモリ"],
    steps: [
      "本体には最大30件まで測定値が保存されます。上限に近づいたら、保存済みの記録をご確認ください。",
      "長く残しておきたい数値は、別途お控えください。本体は長期保管用の記録装置ではありません。",
      "電池を取り外すと保存内容に影響する場合があります。測定の途中ではなく、区切りのよいときに交換してください。",
    ],
    needsJpConfirmation: true,
  },
];

export interface JpWontTurnOnStep {
  index: number;
  title: string;
  instruction: string;
  detail: string;
  warning?: string;
}

export const JP_WONT_TURN_ON_STEPS: JpWontTurnOnStep[] = [
  {
    index: 1,
    title: "電池が入っているかを確認する",
    instruction: "単4形1.5V乾電池が2本、本体に入っているかご確認ください。",
    detail: "電池が入っていない状態では、電源ボタンを押しても反応がありません。",
  },
  {
    index: 2,
    title: "電池の向きを確認する",
    instruction: "電池ケース内の + と − の表示に合っているかご確認ください。",
    detail: "新しい電池でも、1本でも向きが逆だと電源が入りません。",
  },
  {
    index: 3,
    title: "先にシリコンカバーを外す",
    instruction: "裏ぶたを開ける前に、ブルーのシリコンカバーを取り外してください。",
    detail:
      "カバーを付けたまま裏ぶたを開けると、双方に負担がかかり、正しく閉まらなくなることがあります。",
    warning: "カバーを付けたまま、裏ぶたを無理に開けないでください。",
  },
  {
    index: 4,
    title: "新しい電池に交換する",
    instruction: "同じ種類・同じ銘柄の新しい単4形1.5V乾電池2本を入れてください。",
    detail:
      "新旧の電池や種類の異なる電池を混ぜないでください。電池に破損・膨張・液もれが見られる場合は、それ以上お取り扱いにならないでください。",
    warning:
      "破損や液もれがある電池を見つけた場合は、作業を中止し、サポートのご依頼内容にその旨をご記入ください。",
  },
  {
    index: 5,
    title: "元に戻して電源を入れる",
    instruction:
      "裏ぶたを閉め、必要に応じてシリコンカバーを戻してから、電源ボタンを押してください。",
    detail: "電源が入ったら、続けて測定し、通常どおり動作するかご確認ください。",
  },
];

export interface JpFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

/** カテゴリー（お客さま向けの優先順）。 */
export const JP_FAQ_CATEGORIES = [
  "はじめに",
  "測定とスキャン",
  "数値がおかしいと感じたら",
  "体温について",
  "犬と猫",
  "製品とお手入れ",
  "困ったとき",
] as const;

/** 優先表示するカテゴリー。 */
export const JP_FAQ_PRIORITY_CATEGORY = "数値がおかしいと感じたら";

/** お客さま向けの基本的な考え方（FAQ の下に表示）。 */
export const JP_FAQ_PRINCIPLES: string[] = [
  "できるだけ同じ時間帯・同じ環境で、同じ方法で続けてお使いいただくと、その子ならではの毎日の目安がつかみやすくなります。",
  "測定値は体温傾向の参考としてご覧ください。1回の数値だけで健康状態をご判断にならないでください。",
  "高温アラートは、体調に注意を向けるためのサインであり、発熱の診断ではありません。",
  "ご心配なときは獣医師にご相談ください。",
];

export const JP_FAQ_ITEMS: JpFaqItem[] = [
  {
    id: "what-it-does",
    category: "はじめに",
    question: "PCI01 では何ができますか？",
    answer:
      "PCI01 は、コームの歯を備えた犬・猫用の非接触赤外線体温計です。日々の測定を続けることで、その子にとってふだんの傾向を把握しやすくなり、数値が高いときには高温アラートでお知らせします。診断を行うものではなく、獣医師の判断に代わるものでもありません。",
    keywords: ["できること", "用途", "傾向", "観察", "コーム", "アラート", "毎日のケア"],
  },
  {
    id: "how-to-observe",
    category: "測定とスキャン",
    question: "体温傾向はどのように観察しますか？",
    answer:
      "本体の電源を入れ、ペットに合わせて犬用または猫用の設定を選び、ペットに近づけて測定を完了してください。時間帯・環境・ペットの状態・測定方法を毎回できるだけそろえていただくと、傾向がつかみやすくなります。",
    keywords: ["使い方", "手順", "設定", "測定", "傾向"],
  },
  {
    id: "dogs-and-cats",
    category: "犬と猫",
    question: "犬にも猫にも使えますか？",
    answer:
      "はい。お使いになる前に、犬用または猫用の設定をお選びください。記録はペットごとに分けて残し、別のペット同士の1回ずつの数値を比べないようにしてください。",
    keywords: ["犬", "猫", "いぬ", "ねこ", "ペット", "設定"],
  },
  {
    id: "orange-backlight",
    category: "体温について",
    question: "アイスブルーとオレンジのバックライトは何を意味しますか？",
    answer:
      "アイスブルーは、測定値が本製品の日常的な目安の範囲内であることを示します。オレンジは、高めの数値が検出されたことを示しますので、引き続きご様子を観察し、必要に応じて獣医師にご相談ください。色の表示はケアのための目安であり、診断ではありません。",
    keywords: ["オレンジ", "ブルー", "バックライト", "色", "表示", "アラート"],
  },
  {
    id: "sound-alerts",
    category: "体温について",
    question: "音のお知らせは何を意味しますか？",
    answer:
      "音は、操作のご案内や高温アラートのお知らせに使われます。あわせて画面表示とバックライトもご確認いただき、元気さ・活動の様子など、ペットのご様子もあわせてご覧ください。音は注意を向けるためのもので、診断ではありません。",
    keywords: ["音", "サウンド", "お知らせ", "アラート", "ブザー"],
  },
  {
    id: "app-wifi",
    category: "はじめに",
    question: "アプリや Wi-Fi は必要ですか？",
    answer:
      "いいえ。毎日の体温傾向の観察は、アプリや Wi-Fi がなくても本体だけでお使いいただけます。これ以外の接続機能については、最終的な製品仕様と公式の取扱説明に準じます。",
    keywords: ["アプリ", "wifi", "wi-fi", "通信", "スマホ", "接続"],
  },
  {
    id: "batteries",
    category: "製品とお手入れ",
    question: "電池は何を使いますか？",
    answer: "単4形乾電池2本を使用します。電池ケース内の + と − の表示に合わせて入れてください。",
    keywords: ["電池", "乾電池", "単4", "バッテリー", "交換"],
  },
  {
    id: "not-medical",
    category: "体温について",
    question: "PCI01 は医療用の体温計ですか？",
    answer:
      "いいえ。毎日のケア、体温傾向の観察、高温アラートのための製品です。病気を診断するものではなく、獣医師や医療機器に代わるものでもありません。",
    keywords: ["医療", "体温計", "獣医", "診断", "機器"],
  },
  {
    id: "consistency",
    category: "数値がおかしいと感じたら",
    question: "続けて同じように使うほうがよいのはなぜですか？",
    answer:
      "環境やペットの活動量、使い方によって測定値は変わることがあります。条件をそろえていただくことで、その子ならではのふだんの目安がつかみやすくなります。1回の数値ではなく、傾向としてご覧ください。",
    keywords: ["継続", "目安", "傾向", "環境", "習慣"],
  },
  {
    id: "multiple-pets",
    category: "犬と猫",
    question: "1台を複数のペットで使えますか？",
    answer:
      "ペット1匹につき1台をおすすめします。それぞれのふだんの目安が混ざらず、ケアの記録も分かりやすく残せます。",
    keywords: ["複数", "共有", "多頭", "記録", "目安"],
  },
  {
    id: "after-alert",
    category: "体温について",
    question: "高温アラートが出たときはどうすればよいですか？",
    answer:
      "診断ではなく、引き続き観察していただくためのお知らせです。元気さ、活動の様子、食欲、そのほか気になるご様子をご覧いただき、ご心配な場合は獣医師にご相談ください。",
    keywords: ["高温", "アラート", "対処", "観察", "獣医"],
  },
];
