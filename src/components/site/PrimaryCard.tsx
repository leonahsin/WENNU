import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookOpen, PlayCircle, HelpCircle, HeadphonesIcon } from "lucide-react";

interface PrimaryCardLinkProps {
  title: string;
  description: string;
  to: string;
  lang?: string;
  /** "primary" is the single dominant action on the page. */
  emphasis?: "primary" | "secondary";
}

/** Large, low-noise homepage choice. One per key task. */
export function PrimaryCardLink({ to, title, description, emphasis }: PrimaryCardLinkProps) {
  // 1. 邏輯判斷必須放在 return 的「上方」
  let Icon = BookOpen; 
  if (title.includes("Video")) Icon = PlayCircle;
  if (title.includes("FAQ")) Icon = HelpCircle;
  if (title.includes("Support")) Icon = HeadphonesIcon;

  // 2. return 裡面只能放乾淨的畫面標籤，不要放單行註解
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between gap-4 rounded-2xl bg-card p-6 ring-1 ring-border/60 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg"
    >
      <div className="flex flex-col gap-3">
        <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground">
          <Icon className="size-6" />
        </div>
        
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary-foreground/90">
          {description}
        </p>
      </div>

      <div className="mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-1"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}