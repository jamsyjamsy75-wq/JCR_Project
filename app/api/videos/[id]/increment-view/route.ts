import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const videoId = params.id;

    // Incrémenter les vues
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
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'incrémentation des vues" },
      { status: 500 }
    );
  }
}
