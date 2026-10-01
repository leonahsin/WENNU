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
      
      {/* 瘦身 1：將電腦版的上下留白縮減 (lg:py-6)，讓整個橫幅變扁 */}
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-6">
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
        
        <div
          className={
            leadingMedia && media
              ? "grid grid-cols-[1.1fr_1fr] items-center gap-3 lg:grid-cols-[minmax(0,1.3fr)_auto_auto] lg:gap-6"
              : media
                ? "grid grid-cols-[minmax(0,1fr)_minmax(6rem,0.5fr)] items-center gap-x-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-x-8"
                : undefined
          }
        >
          {/* 1. 左側文字區塊 */}
          <div className="col-start-1 min-w-0">
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-warning">
                <Sparkles aria-hidden className="size-4" /> {eyebrow}
              </p>
            ) : null}
            
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              {mobileTitle ? (
                <>
                  <span className="lg:hidden">{mobileTitle}</span>
                  <span className="hidden lg:inline">{title}</span>
                </>
              ) : (
                title
              )}
            </h1>
            
            {(description || mobileDescription) ? (
              <p className="hidden lg:block mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          
          {/* 2. 右側圖片區塊 */}
          {leadingMedia && media ? (
            <div className="col-start-2 flex w-full min-w-0 items-end justify-end gap-1 lg:contents">
              {/* 瘦身 2：大幅壓低電腦版圖片的最高高度限制 (lg:max-h-[180px] xl:max-h-[220px])，防止把選單擠下去 */}
              <div className="w-[75%] min-w-0 shrink-0 lg:w-auto lg:max-w-[280px] xl:max-w-[320px] lg:col-start-2 lg:row-span-2 lg:self-center lg:justify-self-end [&_img]:max-w-full [&_img]:h-auto lg:[&_img]:max-h-[180px] xl:[&_img]:max-h-[220px] [&_img]:object-contain">
                {media}
              </div>
              <div className="w-[25%] min-w-0 shrink-0 lg:w-auto lg:max-w-[90px] xl:max-w-[110px] lg:col-start-3 lg:row-span-2 lg:self-center lg:justify-self-center [&_img]:max-w-full [&_img]:h-auto lg:[&_img]:max-h-[180px] xl:[&_img]:max-h-[220px] [&_img]:object-contain">
                {leadingMedia}
              </div>
            </div>
          ) : media ? (
            <div className="col-start-2 row-start-1 min-w-0 self-center lg:row-span-2 [&_img]:max-w-full [&_img]:h-auto lg:[&_img]:max-h-[220px] [&_img]:object-contain">
              {media}
            </div>
          ) : leadingMedia ? (
            <div className="hidden lg:block lg:col-start-3 lg:row-start-1 [&_img]:max-w-full [&_img]:h-auto lg:[&_img]:max-h-[220px] [&_img]:object-contain">
              {leadingMedia}
            </div>
          ) : null}
          
          {/* 3. 搜尋列等子元件 */}
          {children ? (
            <div
              className={
                leadingMedia && media
                  ? "col-span-2 mt-5 min-w-0 lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:mt-2"
                  : media
                    ? "col-span-2 mt-5 min-w-0 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:mt-2"
                    : "mt-5 min-w-0 lg:mt-2"
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