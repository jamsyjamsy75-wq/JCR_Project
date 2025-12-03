import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mediaVideos } from "@/lib/mediaCatalog";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const videoId = params.id;

    // Vérifier si la vidéo existe en DB
    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId },
      select: { id: true },
    });

    if (existingVideo) {
      // Incrémenter les vues en DB
      const updatedVideo = await prisma.video.update({
        where: { id: videoId },
        data: {
          views: {
            increment: 1,
          },
        },
        select: {
          id: true,
          views: true,
        },
      });

      return NextResponse.json({
        success: true,
        views: updatedVideo.views,
      });
    }

    // Si pas en DB, chercher dans le catalogue (données de fallback)
    const catalogVideo = mediaVideos.find((v) => v.id === videoId);
    if (catalogVideo) {
      // Pour les vidéos du catalogue, on retourne juste les vues actuelles
      // (on ne peut pas les persister sans DB)
      return NextResponse.json({
        success: true,
        views: catalogVideo.views,
        fallback: true, // Indiquer que c'est une donnée de fallback
      });
    }

    // Vidéo introuvable
    return NextResponse.json(
      { error: "Vidéo introuvable" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'incrémentation des vues" },
      { status: 500 }
    );
  }
}
