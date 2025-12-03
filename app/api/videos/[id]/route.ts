import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mediaVideos } from "@/lib/mediaCatalog";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    // Essayer d'abord dans la base de données
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (video) {
      return NextResponse.json({
        id: video.id,
        title: video.title,
        type: video.type,
        duration: video.duration,
        views: video.views,
        coverUrl: video.coverUrl,
        videoUrl: video.videoUrl,
        performer: video.performer,
        ageBadge: video.ageBadge,
        category: {
          id: video.category.id,
          name: video.category.name,
        },
        createdAt: video.createdAt,
      });
    }

    // Fallback : chercher dans le catalogue
    const catalogVideo = mediaVideos.find((v) => v.id === params.id);
    if (catalogVideo) {
      return NextResponse.json({
        id: catalogVideo.id,
        title: catalogVideo.title,
        type: catalogVideo.videoUrl ? "video" : "photo",
        duration: catalogVideo.duration,
        views: catalogVideo.views,
        coverUrl: catalogVideo.coverUrl,
        videoUrl: catalogVideo.videoUrl,
        performer: catalogVideo.performer,
        ageBadge: catalogVideo.ageBadge,
        category: {
          id: 1,
          name: catalogVideo.category,
        },
        createdAt: new Date(),
      });
    }

    return NextResponse.json(
      { error: "Média introuvable" },
      { status: 404 }
    );
  } catch (error) {
    console.error("[GET /api/videos/:id]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
