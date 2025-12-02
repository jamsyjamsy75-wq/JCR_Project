"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { formatDuration, formatViews } from "@/lib/utils";

type VideoDetail = {
  id: string;
  title: string;
  type: string;
  duration: number;
  views: number;
  coverUrl: string;
  videoUrl: string | null;
  performer: string;
  ageBadge: string | null;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
};

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/${params.id}`);
        if (!res.ok) throw new Error("Vidéo non trouvée");
        const data = await res.json();
        setVideo(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVideo();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <div className="text-center">
          <p className="mb-4 text-white">Média introuvable</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-neon-pink px-6 py-2 text-white transition hover:bg-neon-pink/80"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  const isVideo = video.type === "video" && video.videoUrl;
  const mediaUrl = isVideo
    ? `https://res.cloudinary.com/dbtuww2ie/video/upload/q_auto,f_auto/${video.videoUrl}`
    : `https://res.cloudinary.com/dbtuww2ie/image/upload/q_auto,f_auto,w_1200/${video.coverUrl}`;

  return (
    <div className="min-h-screen bg-obsidian text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-white/70 transition hover:text-neon-pink"
        >
          ← Retour
        </button>

        {/* Lecteur vidéo / Image */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-night-lighter">
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="h-auto w-full"
              poster={`https://res.cloudinary.com/dbtuww2ie/video/upload/q_auto,f_auto,w_1200/${video.coverUrl}.jpg`}
            />
          ) : (
            <div className="relative aspect-video w-full">
              <Image
                src={mediaUrl}
                alt={video.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-6">
          {/* Titre et badges */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              {video.ageBadge && (
                <span className="rounded-full bg-neon-pink px-3 py-1 text-sm font-semibold">
                  {video.ageBadge}
                </span>
              )}
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
                {video.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">{video.title}</h1>
          </div>

          {/* Métadonnées */}
          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="text-neon-pink">👤</span>
              <span>{video.performer}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neon-pink">📁</span>
              <span>{video.category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neon-pink">⏱</span>
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neon-pink">👁</span>
              <span>{formatViews(video.views)} vues</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neon-pink">📅</span>
              <span>
                {new Date(video.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="rounded-lg bg-neon-pink px-6 py-3 font-semibold transition hover:bg-neon-pink/80">
              ❤ Ajouter aux favoris
            </button>
            <button className="rounded-lg bg-night-lighter px-6 py-3 font-semibold transition hover:bg-white/10">
              📤 Partager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
