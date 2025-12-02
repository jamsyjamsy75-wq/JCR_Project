import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Média introuvable" },
        { status: 404 }
      );
    }

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
  } catch (error) {
    console.error("[GET /api/videos/:id]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
