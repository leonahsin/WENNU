/**
 * Public navigation.
 *
 * The header stays intentionally small (Home, Video Guides, Troubleshooting,
 * Contact). Product Support, Getting Started and FAQ
 * remain published routes reachable from the footer and contextual links.
 * Admin routes are never listed in public navigation.
 */

export interface NavItem {
  label: string;
  to: string;
}

export const PUBLIC_NAV_US: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Video Guides", to: "/videos" },
  { label: "Troubleshooting", to: "/troubleshooting" },
  { label: "Contact", to: "/contact" },
];

export const PUBLIC_NAV_JP: NavItem[] = [
  { label: "ホーム", to: "/jp" },
  { label: "動画ガイド", to: "/jp/videos" },
  { label: "トラブルシューティング", to: "/jp/troubleshooting" },
  { label: "お問い合わせ", to: "/jp/contact" },
];

export const FOOTER_LINKS_US: NavItem[] = [
  { label: "PCI01 Product Support", to: "/product/pci01" },
  { label: "Getting Started", to: "/getting-started" },
  { label: "Video Guides", to: "/videos" },
  { label: "FAQ", to: "/faq" },
  { label: "Support Request", to: "/support-request" },
];

export const FOOTER_LINKS_JP: NavItem[] = [
  { label: "PCI01 製品サポート", to: "/jp/product/pci01" },
  { label: "はじめてお使いになる方へ", to: "/jp/getting-started" },
  { label: "動画ガイド", to: "/jp/videos" },
  { label: "よくあるご質問", to: "/jp/faq" },
  { label: "サポート依頼", to: "/jp/support-request" },
];
