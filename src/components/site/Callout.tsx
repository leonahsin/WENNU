import { AlertTriangle, Info, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  tone?: "info" | "warning" | "safe";
  title: string;
  children?: ReactNode;
  className?: string;
}

const icons = { info: Info, warning: AlertTriangle, safe: ShieldCheck };

export function Callout({ tone = "info", title, children, className }: CalloutProps) {
  const Icon = icons[tone];
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        tone === "warning" && "border-warning/50 bg-warning-soft",
        tone === "info" && "border-border bg-secondary",
        tone === "safe" && "border-primary/25 bg-secondary",
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          "mt-0.5 size-5 shrink-0",
          tone === "warning" ? "text-warning" : "text-primary",
        )}
      />
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-foreground">{title}</p>
        {children ? <div className="text-muted-foreground">{children}</div> : null}
      </div>
    </div>
  );
}
