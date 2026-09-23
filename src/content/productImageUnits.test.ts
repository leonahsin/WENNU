import { describe, expect, it } from "vitest";
import { productImageForMarket } from "./productImageUnits";

describe("market-specific thermometer images", () => {
  const originals = ["pci01-product-front-v5.png", "pci01-hero.jpg", "pci01-step-mode-v1.png", "pci01-step-scan-v1.png", "pci01-step-baseline-v1.png"];
  it("uses separate Fahrenheit assets only for the US", () => {
    for (const filename of originals) {
      const src = `/images/${filename}`;
      expect(productImageForMarket(src, "us")).toContain("fahrenheit");
      expect(productImageForMarket(src, "jp")).toBe(src);
    }
  });
  it("preserves blank screens and unrelated imagery", () => {
    for (const src of ["/images/pci01-step-position-v1.png", "/images/pet-family-v1.png"]) {
      expect(productImageForMarket(src, "us")).toBe(src);
      expect(productImageForMarket(src, "jp")).toBe(src);
    }
  });
});
