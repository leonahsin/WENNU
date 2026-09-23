import { Lock } from "lucide-react";
import { JP_INTERNAL_PLACEHOLDER } from "@/content/market";
import { cn } from "@/lib/utils";

interface JpDraftNoticeProps {
  label: string;
  className?: string;
}

/**
 * Internal draft marker for the Japan market. Used wherever approved Japanese
 * information is not yet available. This is never final policy.
 */
export function JpDraftNotice({ label, className }: JpDraftNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-dashed border-warning/60 bg-warning-soft p-4",
        className,
      )}
    >
      <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
      <div className="min-w-0 text-sm">
        <p className="break-words font-semibold text-foreground">{label}</p>
        <p className="break-words text-muted-foreground">社内下書き：{JP_INTERNAL_PLACEHOLDER}</p>
      </div>
    </div>
  );
}
