import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label: string;
  note?: string;
  ratio?: "square" | "wide" | "tall";
  className?: string;
}

/**
 * Clearly labeled placeholder used everywhere an official WENNU asset belongs.
 * No product imagery is generated or redrawn.
 */
export function ImagePlaceholder({
  label,
  note = "Awaiting official asset upload",
  ratio = "wide",
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${label}`}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/60 p-6 text-center",
        ratio === "square" && "aspect-square",
        ratio === "wide" && "aspect-[16/10]",
        ratio === "tall" && "aspect-[3/4]",
        className,
      )}
    >
      <ImageIcon aria-hidden className="size-6 text-muted-foreground" />
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
