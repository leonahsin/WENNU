import { cn } from "@/lib/utils";

export const PCI01_IMAGES = {
  front: "/images/pci01-hero.jpg",
  angle: "/images/pci01-hero.jpg",
  cover: "/images/pci01-hero.jpg",
} as const;

interface ProductImageProps {
  view?: keyof typeof PCI01_IMAGES;
  alt: string;
  caption?: string;
  ratio?: "square" | "wide" | "tall";
  className?: string;
  priority?: boolean;
}

/**
 * Official PCI01 product photography. Always object-contain so the complete
 * device stays visible; never cropped, stretched, recolored or restyled.
 */
export function ProductImage({
  view = "front",
  alt,
  caption,
  ratio = "square",
  className,
  priority = false,
}: ProductImageProps) {
  return (
    <figure className={cn("w-full", className)}>
      <div
        className={cn(
          "flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-4",
          ratio === "square" && "aspect-square",
          ratio === "wide" && "aspect-[16/10]",
          ratio === "tall" && "aspect-[3/4]",
        )}
      >
        <img
          src={PCI01_IMAGES[view]}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
