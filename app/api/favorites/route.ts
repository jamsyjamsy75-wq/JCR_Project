import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Récupérer les IDs des vidéos favorites de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ favoriteIds: [] });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ favoriteIds: [] });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { videoId: true },
    });

    const favoriteIds = favorites.map((fav: any) => fav.videoId);
    return NextResponse.json({ favoriteIds });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ favoriteIds: [] });
  }
}

// POST - Ajouter une vidéo aux favoris
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Vérifier si la vidéo existe
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Vérifier si déjà en favoris
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { message: "Already in favorites" },
        { status: 200 }
      );
    }

    // Ajouter aux favoris
    await prisma.favorite.create({
      data: {
        userId,
        videoId,
      },
    });

    return NextResponse.json(
      { message: "Added to favorites" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Retirer une vidéo des favoris
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    await prisma.favorite.delete({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    return NextResponse.json(
      { message: "Removed from favorites" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
