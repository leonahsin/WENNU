/**
 * Product selection catalog for the general support entry.
 *
 * PCI01 is the only product with published support content. PCM01 / PCM02 are
 * placeholders only: no details, no specifications and no active routes are
 * invented for them.
 */

import type { MarketId } from "./market";

export interface CatalogEntry {
  id: "pci01" | "pcm01" | "pcm02";
  name: string;
  description: string;
  to: string | null;
  available: boolean;
  comingSoonLabel?: string;
}

export const CATALOG_US: CatalogEntry[] = [
  {
    id: "pci01",
    name: "PCI01",
    description: "Support for the PCI01 non-contact infrared pet thermometer.",
    to: "/product/pci01",
    available: true,
  },
  {
    id: "pcm01",
    name: "PCM01",
    description: "Support content is not available yet.",
    to: null,
    available: false,
    comingSoonLabel: "Coming soon",
  },
  {
    id: "pcm02",
    name: "PCM02",
    description: "Support content is not available yet.",
    to: null,
    available: false,
    comingSoonLabel: "Coming soon",
  },
];

export const CATALOG_JP: CatalogEntry[] = [
  {
    id: "pci01",
    name: "PCI01",
    description: "PCI01（体温傾向観察コーム）のサポートはこちらです。",
    to: "/jp/product/pci01",
    available: true,
  },
  {
    id: "pcm01",
    name: "PCM01",
    description: "サポート情報は準備中です。",
    to: null,
    available: false,
    comingSoonLabel: "準備中",
  },
  {
    id: "pcm02",
    name: "PCM02",
    description: "サポート情報は準備中です。",
    to: null,
    available: false,
    comingSoonLabel: "準備中",
  },
];

export function catalogForMarket(market: MarketId): CatalogEntry[] {
  return market === "jp" ? CATALOG_JP : CATALOG_US;
}
