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
         : "flex flex-col h-full overflow-hidden rounded-2xl bg-card ring-1 ring-border/60"
      }
    >
  <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-[#eef2ef]">
  {isPlaying && videoUrl ? (
    <iframe
      src={`${videoUrl}&autoplay=1`}
      title={video.title}
      className="h-full w-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : thumbnailUrl ? (
    <div 
      className="relative block h-full w-full cursor-pointer group"
      onClick={() => setIsPlaying(true)}
    >
      <img
        src={thumbnailUrl}
        alt={video.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <Film className="size-10 text-muted-foreground/40" />
      <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
        Video coming soon
      </div>
    </div>
  )}
</div>

      <div className={featured ? "min-w-0" : "flex flex-col flex-1 p-5"}>
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