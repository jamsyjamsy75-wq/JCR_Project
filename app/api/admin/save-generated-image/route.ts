import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { image, title, performer, categoryId } = await request.json();

    if (!image || !title || !performer || !categoryId) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Extraire les données de l'image base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Upload vers Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { error: "Configuration Cloudinary manquante" },
        { status: 500 }
      );
    }

    // Créer un FormData pour l'upload
    const formData = new FormData();
    formData.append("file", `data:image/jpeg;base64,${base64Data}`);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "Photo_IA"); // Dossier pour les images générées par IA

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text();
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'upload vers Cloudinary" },
        { status: 500 }
      );
    }

    const cloudinaryData = await cloudinaryResponse.json();
    const publicId = cloudinaryData.public_id;

    // Générer un ID unique pour la vidéo
    const videoId = `ai-gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Sauvegarder en base de données
    const video = await prisma.video.create({
      data: {
        id: videoId,
        title,
        performer,
        categoryId: parseInt(categoryId),
        coverUrl: publicId,
        videoUrl: null, // Pas de vidéo, juste une image
        type: "photo",
        duration: 0,
        views: 0,
        ageBadge: "18+",
      },
    });

    return NextResponse.json({
      success: true,
      video,
      cloudinaryUrl: cloudinaryData.secure_url,
    });

  } catch (error) {
    console.error("Erreur sauvegarde image:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}
