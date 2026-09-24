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
  mobileTitle?: string; // 手機版專用短標題（可選）
  description?: ReactNode;
  mobileDescription?: ReactNode; // 手機版專用短描述（可選）
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
            leadingMedia
              ? "pci-support-hero-grid"
              : media
                ? "grid grid-cols-[minmax(0,1fr)_minmax(6rem,0.5fr)] items-center gap-x-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-x-8"
                : undefined
          }
        >
          <div className={leadingMedia ? "pci-support-hero-copy min-w-0" : "min-w-0"}>
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-warning">
                <Sparkles aria-hidden className="size-4" /> {eyebrow}
              </p>
            ) : null}
            
            {/* 標題：支援手機版短標題、電腦版長標題切換 */}
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              {mobileTitle ? (
                <>
                  <span className="sm:hidden">{mobileTitle}</span>
                  <span className="hidden sm:inline">{title}</span>
                </>
              ) : (
                title
              )}
            </h1>
            
            {/* 描述：支援手機版短描述、電腦版長描述切換 */}
            {(description || mobileDescription) ? (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {mobileDescription ? (
                  <>
                    <span className="sm:hidden">{mobileDescription}</span>
                    <span className="hidden sm:inline">{description}</span>
                  </>
                ) : (
                  description
                )}
              </p>
            ) : null}
          </div>
          
         {leadingMedia ? <div className="pci-support-hero-product hidden sm:block">{leadingMedia}</div> : null}
            <div
              className={
                leadingMedia
                  ? "pci-support-hero-pets"
                  : "col-start-2 row-start-1 min-w-0 self-center lg:row-span-2"
              }
            >
              {media}
            </div>
           : null
          {children ? (
            <div
              className={
                leadingMedia
                  ? "pci-support-hero-search min-w-0"
                  : `mt-6 min-w-0 ${media ? "col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2" : ""}`
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