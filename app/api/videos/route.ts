import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  mediaVideos,
  normalizeCategorySlug,
} from "@/lib/mediaCatalog";

const filterFallbackVideos = (
  category?: string | null,
  slug?: string | null,
  type?: string | null
) => {
  let filtered = mediaVideos;

  // Filtre par catégorie
  if (
    category &&
    category !== "all" &&
    category !== "Trending" &&
    slug !== "trending"
  ) {
    filtered = filtered.filter((video) => {
      if (video.category === category) return true;
      const videoSlug = normalizeCategorySlug(video.category);
      return !!slug && videoSlug === slug;
    });
  }

  // Filtre par type (photo/video)
  if (type && ["photo", "video"].includes(type)) {
    filtered = filtered.filter((video) => {
      const videoType = video.videoUrl ? "video" : "photo";
      return videoType === type;
    });
  }

  return filtered;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type"); // "photo", "video" ou null
  const limitParam = searchParams.get("limit");
  const take = Math.min(Number(limitParam) || 50, 100);

  const normalizedCategory = normalizeCategorySlug(category);

  const buildResponse = (videos: typeof mediaVideos, fallback = false) =>
    NextResponse.json({
      data: videos.map((video) => ({
        id: video.id,
        title: video.title,
        category: video.category,
        duration: video.duration,
        views: video.views,
        isHd: video.isHd,
        coverUrl: video.coverUrl,
        videoUrl: video.videoUrl,
        performer: video.performer,
        ageBadge: video.ageBadge,
        type: video.videoUrl ? "video" : "photo",
      })),
      meta: {
        total: videos.length,
        fallback,
      },
    });

  try {
    const where: any = {
      isPublic: true, // Afficher uniquement les vidéos publiques sur l'accueil
    };

    // Filtre par catégorie
    if (category && category !== "all" && normalizedCategory !== "trending") {
      where.OR = [
        { category: { name: category } },
        ...(normalizedCategory
          ? [{ category: { slug: normalizedCategory } }]
          : []),
      ];
    }

    // Filtre par type (photo/video)
    if (type && ["photo", "video"].includes(type)) {
      where.type = type;
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take,
      }),
      prisma.video.count({ where }),
    ]);

    if (!videos.length) {
      const fallbackList = filterFallbackVideos(category, normalizedCategory, type);
      return buildResponse(fallbackList, true);
    }

    return NextResponse.json({
      data: videos.map((video) => ({
        id: video.id,
        title: video.title,
        category: video.category.name,
        duration: video.duration,
        views: video.views,
        isHd: video.isHd,
        coverUrl: video.coverUrl,
        videoUrl: video.videoUrl,
        performer: video.performer,
        ageBadge: video.ageBadge,
        type: video.type,
      })),
      meta: {
        total,
      },
    });
  } catch (error) {
    console.error("[GET /api/videos]", error);
    const fallbackList = filterFallbackVideos(category, normalizedCategory, type);
    return buildResponse(fallbackList, true);
  }
}


