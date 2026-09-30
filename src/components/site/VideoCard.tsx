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
  const thumbnailUrl = video.thumbnailUrl;
  const videoUrl = video.videoUrl;
  
  // 判斷是否為「即將推出 (Coming soon)」：如果沒有 videoUrl，就代表影片尚未上傳
  const isComingSoon = !videoUrl;
  
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
        {isPlaying && videoUrl && !isComingSoon ? (
          <iframe
            src={`${videoUrl.includes("?") ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`}`}
            title={video.title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : thumbnailUrl ? (
          <div 
            className={`relative block h-full w-full ${isComingSoon ? "cursor-not-allowed" : "cursor-pointer group"}`}
            onClick={() => !isComingSoon && setIsPlaying(true)}
          >
            {/* 縮圖 */}
            <img
              src={thumbnailUrl}
              alt={video.title}
              className={`h-full w-full object-cover transition-transform duration-300 ${isComingSoon ? "grayscale-[40%] brightness-90" : "group-hover:scale-105"}`}
            />

            {/* 如果尚未上傳，覆蓋半透明灰色遮罩與 Coming soon 標籤 */}
            {isComingSoon && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                <div className="rounded-full bg-black/60 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-md">
                  {comingSoonLabel}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Film className="size-10 text-muted-foreground/40" />
            <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              {comingSoonLabel}
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