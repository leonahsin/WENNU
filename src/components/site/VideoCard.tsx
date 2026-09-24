import { Film } from "lucide-react";
import { useState } from "react";
import type { VideoGuide } from "@/content/videos";

interface VideoCardProps {
  video: VideoGuide;
  categoryLabel: string;
  comingSoonLabel: string;
  durationPlaceholder: string;
  thumbnailAlt: string;
  lang?: string;
  featured?: boolean;
}

export function VideoCard({
  video,
  categoryLabel,
  comingSoonLabel,
  durationPlaceholder,
  thumbnailAlt,
  lang,
  featured = false,
}: VideoCardProps) {
  // 已經拿掉防呆預設圖，現在完全讀取你在 videos.ts 填寫的網址
  const thumbnailUrl = video.thumbnailUrl;
  const videoUrl = video.videoUrl;
  
  // 點擊後自動播放的設定
  const autoPlayUrl = videoUrl ? (videoUrl.includes("?") ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`) : "";
  
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
          if (videoUrl) setIsPlaying(true);
        }}
      >
        {isPlaying && videoUrl ? (
          <iframe
            className="h-full w-full object-cover"
            src={autoPlayUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={thumbnailAlt}
                loading={featured ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              // 如果某個影片還沒填寫圖片網址，會顯示這個乾淨的灰色底圖取代
              <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary">
                <Film aria-hidden className="size-8" />
              </div>
            )}
            {/* 白底灰字的影片長度提示已經被刪除 */}
          </>
        )}
      </div>

      <div className={featured ? "min-w-0" : "flex flex-1 flex-col gap-2 p-5"}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {categoryLabel}
        </p>
        <h3 className={featured ? "mt-2 break-words text-2xl font-semibold text-foreground" : "break-words text-base font-semibold text-foreground"}>
          {video.title}
        </h3>
        <p className={featured ? "mt-2 break-words text-base text-muted-foreground" : "break-words text-sm text-muted-foreground"}>
          {video.description}
        </p>
      </div>
    </article>
  );
}