import { Link } from "@tanstack/react-router";
import { BookOpen, PlayCircle, HelpCircle, HeadphonesIcon } from "lucide-react";

interface PrimaryCardLinkProps {
  title: string;
  description: string;
  to: string;
  lang?: string;
  emphasis?: "primary" | "secondary";
  image?: string; // 💡 1. 告訴卡片它現在會收到一個圖片路徑
}

/** Large, low-noise homepage choice. One per key task. */
export function PrimaryCardLink({ to, title, description, emphasis, image }: PrimaryCardLinkProps) { // 💡 2. 把 image 拿出來用
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
        {/* 💡 3. 新增的相框：如果傳進了圖片，就在標題上方印出來 */}
        {image ? (
          <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-secondary/20">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : null}

        {/* 把圖示跟標題包在同一個 flex 橫列裡 */}
        <div className="flex items-center gap-3">
          <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground">
            <Icon className="size-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>
        
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