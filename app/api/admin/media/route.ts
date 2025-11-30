import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// GET - Liste tous les médias (admin uniquement)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "photo", "video" ou null (tous)
    const categoryId = searchParams.get("categoryId");

    const where: any = {};
    if (type && ["photo", "video"].includes(type)) {
      where.type = type;
    }
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const medias = await prisma.video.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: medias.map((media) => ({
        id: media.id,
        title: media.title,
        type: media.type,
        duration: media.duration,
        views: media.views,
        isHd: media.isHd,
        coverUrl: media.coverUrl,
        videoUrl: media.videoUrl,
        performer: media.performer,
        ageBadge: media.ageBadge,
        category: {
          id: media.category.id,
          name: media.category.name,
        },
        createdAt: media.createdAt,
      })),
    });
  } catch (error) {
    console.error("[GET /api/admin/media]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des médias" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau média (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      type,
      duration,
      isHd,
      coverUrl,
      videoUrl,
      performer,
      ageBadge,
      categoryId,
    } = body;

    // Validation
    if (!title || !type || !coverUrl || !categoryId) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    if (!["photo", "video"].includes(type)) {
      return NextResponse.json(
        { error: "Type invalide (photo ou video)" },
        { status: 400 }
      );
    }

    // Générer un ID unique
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const media = await prisma.video.create({
      data: {
        id,
        title,
        type,
        duration: duration || 0,
        isHd: isHd || false,
        coverUrl,
        videoUrl: videoUrl || null,
        performer: performer || "Inconnu",
        ageBadge: ageBadge || null,
        categoryId: parseInt(categoryId),
      },
      include: { category: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: media.id,
        title: media.title,
        type: media.type,
        category: media.category.name,
      },
    });
  } catch (error) {
    console.error("[POST /api/admin/media]", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du média" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un média (admin uniquement)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID du média requis" },
        { status: 400 }
      );
    }

    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Média supprimé avec succès",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/media]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du média" },
      { status: 500 }
    );
  }
}
