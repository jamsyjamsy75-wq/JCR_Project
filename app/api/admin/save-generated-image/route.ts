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

    // Upload vers Cloudinary avec API authentifiée
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

    // Créer la signature pour l'upload authentifié
    const timestamp = Math.round(Date.now() / 1000);
    const crypto = await import('crypto');
    
    const paramsToSign = `folder=Photo_IA&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    // Créer un FormData pour l'upload
    const formData = new FormData();
    formData.append("file", `data:image/png;base64,${base64Data}`);
    formData.append("folder", "Photo_IA");
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

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
