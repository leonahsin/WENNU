import type { MarketId } from "@/content/market";

// Separate assets keep the Japanese experience on its original Celsius photos.
const US_IMAGE_SOURCES: Record<string, string> = {
  "/images/pci01-product-front-v5.png": "/images/pci01-product-front-teal-fahrenheit-v4.svg",
  "/images/pci01-hero.jpg": "/images/pci01-hero-teal-fahrenheit-v3.png",
  "/images/pci01-step-mode-v1.png": "/images/pci01-step-mode-teal-fahrenheit-v3.png",
  "/images/pci01-step-scan-v1.png": "/images/pci01-step-scan-teal-fahrenheit-v3.png",
  "/images/pci01-step-baseline-v1.png": "/images/pci01-step-baseline-teal-fahrenheit-v3.png",
};

export function productImageForMarket(src: string, market: MarketId): string {
  return market === "us" ? (US_IMAGE_SOURCES[src] ?? src) : src;
}
