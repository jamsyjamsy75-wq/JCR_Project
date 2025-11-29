"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { formatDuration, formatViews, VideoCardModel, getCloudinaryUrl } from "@/lib/utils";

type VideoCardProps = {
  video: VideoCardModel;
};

const VideoCard = ({ video }: VideoCardProps) => {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handlePreviewStart = () => {
    previewRef.current?.play().catch(() => {});
  };

  const handlePreviewStop = () => {
    if (!previewRef.current) return;
    previewRef.current.pause();
    previewRef.current.currentTime = 0;
  };

  // Construire les URLs Cloudinary ou locales
  const coverImageUrl = getCloudinaryUrl(video.coverUrl, "image");
  const videoPreviewUrl = video.videoUrl ? getCloudinaryUrl(video.videoUrl, "video") : null;
  const isLocalMedia = coverImageUrl.startsWith("/api/local-media");

  // Intersection Observer pour démarrer la vidéo quand visible à 50%
  useEffect(() => {
    if (!cardRef.current || !videoPreviewUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            previewRef.current?.play().catch(() => {});
          } else {
            setIsVisible(false);
            if (previewRef.current) {
              previewRef.current.pause();
              previewRef.current.currentTime = 0;
            }
          }
        });
      },
      { threshold: 0.5 } // 50% visible
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [videoPreviewUrl]);

  return (
    <article
      ref={cardRef}
      className="group relative mb-6 break-inside-avoid rounded-3xl border border-white/5 bg-gradient-to-b from-slate-850 to-obsidian shadow-[0_25px_60px_rgba(0,0,0,0.35)] transition hover:-translate-y-2 hover:border-neon-pink/40 hover:shadow-glow"
      onMouseEnter={handlePreviewStart}
      onMouseLeave={handlePreviewStop}
    >
      <div className="relative overflow-hidden rounded-t-3xl">
        {isLocalMedia ? (
          <img
            src={coverImageUrl}
            alt={video.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <Image
            src={coverImageUrl}
            alt={video.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        )}
        {videoPreviewUrl && (
          <video
            ref={previewRef}
            src={videoPreviewUrl}
            muted
            playsInline
            loop
            preload="metadata"
            poster={coverImageUrl}
            className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
              isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-0 transition group-hover:opacity-100" />
        <div className="absolute left-4 top-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.4em]">
          {video.isHd && (
            <span className="rounded-full bg-black/80 px-3 py-1 text-white">
              4K
            </span>
          )}
          {video.ageBadge && (
            <span className="rounded-full bg-neon-pink/80 px-3 py-1 text-white">
              {video.ageBadge}
            </span>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <span className="rounded-full border border-neon-pink px-5 py-2 text-xs font-semibold uppercase tracking-[0.5em] text-white shadow-glow">
            ▶ play
          </span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-semibold text-white/80">
          <span className="rounded-full bg-black/60 px-3 py-1">
            {formatDuration(video.duration)}
          </span>
          <span className="rounded-full bg-black/60 px-3 py-1">
            {formatViews(video.views)} vues
          </span>
        </div>
      </div>
      <div className="space-y-2 px-5 py-6">
        <p className="text-[10px] uppercase tracking-[0.6em] text-neon-pink">
          {video.category}
        </p>
        <h3 className="text-lg font-semibold text-white">{video.title}</h3>
        <p className="text-sm text-white/60">{video.performer}</p>
      </div>
    </article>
  );
};

export default VideoCard;


