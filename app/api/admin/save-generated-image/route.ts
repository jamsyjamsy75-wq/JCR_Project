import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

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

    // Configuration Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Configuration Cloudinary manquante:", { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
      return NextResponse.json(
        { error: "Configuration Cloudinary manquante" },
        { status: 500 }
      );
    }

    // Configurer Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Upload vers Cloudinary en utilisant le SDK
    console.log("🚀 Upload vers Cloudinary...");
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "Photo_IA",
      resource_type: "image",
    });

    console.log("✅ Upload réussi:", uploadResult.public_id);
    const publicId = uploadResult.public_id;

    // Générer un ID unique pour la vidéo
    const videoId = `ai-gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Sauvegarder en base de données avec le créateur
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
        createdBy: session.user.id, // Enregistrer le créateur
      },
    });

    return NextResponse.json({
      success: true,
      video,
      cloudinaryUrl: uploadResult.secure_url,
    });

  } catch (error) {
    console.error("Erreur sauvegarde image:", error);
    
    // Log plus détaillé pour le débogage
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }
    
    return NextResponse.json(
      { 
        error: "Erreur serveur lors de la sauvegarde",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}
