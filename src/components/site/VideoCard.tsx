import { Film, Play } from "lucide-react";
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
  // 1. 如果你原本的圖片網址失效，自動套用一張好看的預設圖避免破圖
  const thumbnailUrl = video.thumbnailUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800";
  const videoUrl = video.videoUrl || "https://www.youtube.com/embed/FK1stNDefus";
  
  // 2. 確保點擊後 YouTube 會自動播放
  const autoPlayUrl = videoUrl.includes("?") ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`;
  
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
        onClick={() => setIsPlaying(true)}
      >
        {isPlaying ? (
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
            <img
              src={thumbnailUrl}
              alt={thumbnailAlt}
              loading={featured ? "eager" : "lazy"}
              decoding="async"
              // 使用 object-cover 讓圖片完美填滿框框
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* 綠色的大播放鍵已經移除了！只保留左下角的影片長度提示 */}
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-md bg-card/95 px-2 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
              <Play aria-hidden className="size-3.5" />
              {video.duration ?? durationPlaceholder}
            </span>
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