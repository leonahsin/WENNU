import { Film, Play } from "lucide-react";
import { useState } from "react";
import type { VideoGuide } from "@/content/videos";
import { isPlayable } from "@/content/videos";

interface VideoCardProps {
  video: VideoGuide;
  categoryLabel: string;
  comingSoonLabel: string;
  /** Shown when no confirmed duration exists yet. */
  durationPlaceholder: string;
  thumbnailAlt: string;
  lang?: string;
  featured?: boolean;
}

/**
 * Video guide card. Cards without an approved published video never open a
 * player — they render a clear coming-soon state instead.
 */
export function VideoCard({
  video,
  categoryLabel,
  comingSoonLabel,
  durationPlaceholder,
  thumbnailAlt,
  lang,
  featured = false,
}: VideoCardProps) {
  const playable = isPlayable(video);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <article
      lang={lang}
      className={
        featured
          ? "grid gap-6 overflow-hidden rounded-3xl bg-card p-5 ring-1 ring-border/60 sm:grid-cols-2 sm:items-center sm:p-7"
          : "flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border/60"
      }
    >
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary cursor-pointer group"
        onClick={() => {
          if (playable && video.videoUrl) {
            setIsPlaying(true);
          }
        }}
      >
        {playable && video.videoUrl && isPlaying ? (
          <video
            controls
            autoPlay
            playsInline
            poster={video.thumbnailUrl ?? undefined}
            className="h-full w-full object-cover"
            src={video.videoUrl}
          >
            {video.captionsUrl ? (
              <track kind="captions" src={video.captionsUrl} srcLang={video.locale} default />
            ) : null}
          </video>
        ) : (
          <>
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={thumbnailAlt}
                loading={featured ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                role="img"
                aria-label={thumbnailAlt}
                className="flex h-full w-full items-center justify-center text-muted-foreground"
              >
                <Film aria-hidden className="size-8" />
              </div>
            )}

            {playable && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Play className="size-6 ml-0.5" />
                </div>
              </div>
            )}

            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-md bg-card/95 px-2 py-1 text-xs font-semibold text-muted-foreground">
              {playable ? <Play aria-hidden className="size-3.5" /> : null}
              {playable ? (video.duration ?? durationPlaceholder) : comingSoonLabel}
            </span>
          </>
        )}
      </div>

      <div className={featured ? "min-w-0" : "flex flex-1 flex-col gap-2 p-5"}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {categoryLabel}
        </p>
        <h3
          className={
            featured
              ? "mt-2 break-words text-2xl font-semibold text-foreground"
              : "break-words text-base font-semibold text-foreground"
          }
        >
          {video.title}
        </h3>
        <p
          className={
            featured
              ? "mt-2 break-words text-base text-muted-foreground"
              : "break-words text-sm text-muted-foreground"
          }
        >
          {video.description}
        </p>
        <p className={featured ? "mt-3 text-xs text-muted-foreground" : "text-xs text-muted-foreground"}>
          {video.duration ?? durationPlaceholder}
        </p>
    </div>
    </article>
  );
}
