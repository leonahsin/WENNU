/**
 * Product catalog.
 *
 * There is currently exactly ONE physical product: the PCI01 Pet Thermometer.
 * Dog and cat are usage guides for the same device, not separate products.
 * Bare use and use with the blue silicone cover are setup/care states,
 * not separate products.
 *
 * Future products can be appended to PRODUCTS without changing components.
 */

export type ProductId = "pci01";
export type GuideId = "dog" | "cat";
export type CoverState = "without-cover" | "with-cover";

export interface UsageGuide {
  id: GuideId;
  name: string;
  summary: string;
  imageLabel: string;
}

export interface Product {
  id: ProductId;
  name: string;
  shortName: string;
  category: string;
  summary: string;
  batteries: string;
  storedRecords: number;
  minScanSeconds: number;
  guides: UsageGuide[];
  imageLabel: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "pci01",
    name: "PCI01 Pet Thermometer",
    shortName: "PCI01",
    category: "Pet Thermometer",
    summary:
      "One device with two usage guides. Use the dog guide or the cat guide depending on the pet you are scanning.",
    batteries: "Two AAA 1.5V batteries",
    storedRecords: 30,
    minScanSeconds: 7,
    imageLabel: "Official PCI01 Pet Thermometer product photo",
    guides: [
      {
        id: "dog",
        name: "Dog Guide",
        summary:
          "Usage guide for scanning dogs with the PCI01. Same device, dog-specific handling and positioning steps.",
        imageLabel: "Official PCI01 dog usage photo",
      },
      {
        id: "cat",
        name: "Cat Guide",
        summary:
          "Usage guide for scanning cats with the PCI01. Same device, cat-specific handling and positioning steps.",
        imageLabel: "Official PCI01 cat usage photo",
      },
    ],
  },
];

export const PCI01 = PRODUCTS[0]!;

export const COVER_STATES: { id: CoverState; label: string; description: string }[] = [
  {
    id: "without-cover",
    label: "Without the blue silicone cover",
    description:
      "The device is used bare. The back cover can be opened directly for battery changes.",
  },
  {
    id: "with-cover",
    label: "With the blue silicone cover",
    description:
      "The blue silicone cover is fitted over the device. Remove the cover before opening the back cover.",
  },
];
