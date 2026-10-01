import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  mobileTitle?: string;
  description?: ReactNode;
  mobileDescription?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  media?: ReactNode;
  leadingMedia?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  mobileTitle,
  description,
  mobileDescription,
  crumbs,
  children,
  media,
  leadingMedia,
}: PageHeaderProps) {
  return (
    <header className="hero-support relative overflow-hidden border-b border-primary/15">
      <div
        aria-hidden
        className="absolute -right-16 -top-20 size-64 rounded-full border-[42px] border-warning/10"
      />
      <div
        aria-hidden
        className="absolute bottom-5 right-[22%] size-20 rounded-full bg-primary/5"
      />
      
      <div className="relative mx-auto w-full max-w-6xl px-4 py-9 sm:px-6 sm:py-14">
        {/* 麵包屑導覽 */}
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {i > 0 ? <ChevronRight aria-hidden className="size-3.5" /> : null}
                  {crumb.to ? (
                    <Link
                      to={crumb.to as NonNullable<LinkProps["to"]>}
                      className="underline-offset-4 hover:underline"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        
        {/* 核心排版：
            - 手機版 (md 以下)：採用 flex-row，左邊文字、右邊圖片並排。
            - 電腦版 (md 以上)：採用 grid 三欄網格。 */}
        <div
          className={
            leadingMedia && media
              ? "flex flex-row items-center justify-between gap-2 md:grid md:grid-cols-[1.4fr_auto_auto] md:gap-8"
              : media
                ? "grid grid-cols-[1fr_auto] items-center gap-x-3 md:grid-cols-[1.7fr_1fr] md:gap-x-8"
                : "flex flex-col"
          }
        >
          {/* 1. 文字區塊 */}
          <div className="min-w-0 flex-1 md:col-start-1 md:row-start-1">
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-warning">
                <Sparkles aria-hidden className="size-4" /> {eyebrow}
              </p>
            ) : null}
            
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              {mobileTitle ? (
                <>
                  <span className="md:hidden">{mobileTitle}</span>
                  <span className="hidden md:inline">{title}</span>
                </>
              ) : (
                title
              )}
            </h1>
            
            {/* 說明文字：強制在手機版隱藏 (hidden md:block)，只留標題讓畫面乾淨 */}
            {(description || mobileDescription) ? (
              <p className="hidden md:block mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          
          {/* 2. 圖片區塊 */}
          {leadingMedia && media ? (
            <>
              {/* 【手機版專屬圖片區塊】強制靠右並排，並鎖定比例不讓圖片消失 */}
              <div className="flex shrink-0 items-end justify-end gap-2 pl-2 md:hidden">
                <div className="w-[6.5rem] shrink-0 sm:w-32">{media}</div>
                <div className="w-[2.75rem] shrink-0 sm:w-14">{leadingMedia}</div>
              </div>

              {/* 【電腦版專屬圖片區塊】依照網格各就各位，完美還原 */}
              <div className="hidden md:flex md:col-start-2 md:row-start-1 items-center justify-center">
                {media}
              </div>
              <div className="hidden md:flex md:col-start-3 md:row-start-1 items-center justify-center">
                {leadingMedia}
              </div>
            </>
          ) : media ? (
            <div className="col-start-2 row-start-1 min-w-0 self-center md:row-span-2">
              {media}
            </div>
          ) : leadingMedia ? (
            <div className="hidden md:block md:col-start-3 md:row-start-1">
              {leadingMedia}
            </div>
          ) : null}
          
          {/* 3. 搜尋列等子元件區塊 */}
          {children ? (
            <div
              className={
                leadingMedia && media
                  ? "col-span-full mt-4 w-full min-w-0 md:col-span-3 md:col-start-1 md:row-start-2"
                  : "col-span-full mt-6 w-full min-w-0 md:col-span-1 md:col-start-1 md:row-start-2"
              }
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}