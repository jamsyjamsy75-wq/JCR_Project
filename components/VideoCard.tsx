"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { formatDuration, formatViews, VideoCardModel, getCloudinaryUrl } from "@/lib/utils";

type VideoCardProps = {
  video: VideoCardModel;
  isFavorite?: boolean;
  onToggleFavorite?: (videoId: string) => void;
};

const VideoCard = ({ video, isFavorite = false, onToggleFavorite }: VideoCardProps) => {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreviewStart = () => {
    previewRef.current?.play().catch(() => {});
  };

  const handlePreviewStop = () => {
    if (!previewRef.current) return;
    previewRef.current.pause();
    previewRef.current.currentTime = 0;
  };

  // Construire les URLs Cloudinary ou locales
  // Détecter le type basé sur le chemin du coverUrl (Photo_IA vs Vidéo_IA)
  const isVideoMedia = video.coverUrl.includes("Vidéo_IA") || video.coverUrl.includes("Video_IA");
  const coverImageUrl = getCloudinaryUrl(
    video.coverUrl,
    isVideoMedia ? "video" : "image",
    isVideoMedia // Ajouter .jpg pour miniature vidéo seulement
  );
  const videoPreviewUrl = video.videoUrl ? getCloudinaryUrl(video.videoUrl, "video", false) : null;
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

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onToggleFavorite) return;

    setIsLoading(true);
    await onToggleFavorite(video.id);
    setIsLoading(false);
  };

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
        {videoPreviewUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
            <span className="rounded-full border border-neon-pink px-5 py-2 text-xs font-semibold uppercase tracking-[0.5em] text-white shadow-glow">
              ▶ play
            </span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-semibold text-white/80">
          <span className="rounded-full bg-black/60 px-3 py-1">
            {formatDuration(video.duration)}
          </span>
          <span className="rounded-full bg-black/60 px-3 py-1">
            {formatViews(video.views)} vues
          </span>
        </div>
        
        {/* Bouton Favori */}
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:scale-110 hover:bg-neon-pink/80 disabled:opacity-50"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isFavorite ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-neon-pink"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
        </button>
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


