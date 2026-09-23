import { Lock } from "lucide-react";
import { INTERNAL_PLACEHOLDER } from "@/content/market";
import { cn } from "@/lib/utils";

interface InternalPlaceholderProps {
  label: string;
  className?: string;
}

/** Visibly marked placeholder for operational data that must not be invented. */
export function InternalPlaceholder({ label, className }: InternalPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-dashed border-warning/60 bg-warning-soft p-4",
        className,
      )}
    >
      <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
      <div className="text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">{INTERNAL_PLACEHOLDER}</p>
      </div>
    </div>
  );
}
