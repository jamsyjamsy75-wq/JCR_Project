import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

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

    const { prompt, negativePrompt, width, height } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Le prompt est requis" },
        { status: 400 }
      );
    }

    // Token Hugging Face (gratuit) - à ajouter dans .env
    const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;
    
    if (!HF_TOKEN) {
      return NextResponse.json(
        { error: "HUGGING_FACE_TOKEN manquant dans .env" },
        { status: 500 }
      );
    }

    // Appeler Hugging Face Inference API
    // Modèle : Stable Diffusion XL (officiel, NSFW autorisé)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt || "ugly, blurry, low quality, distorted",
            width: width || 1024,
            height: height || 1024,
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Hugging Face error:", error);
      
      // Si le modèle est en train de charger
      if (response.status === 503) {
        return NextResponse.json(
          { 
            error: "Le modèle est en cours de chargement. Réessayez dans 20 secondes.",
            retryAfter: 20 
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: "Erreur lors de la génération" },
        { status: response.status }
      );
    }

    // Récupérer l'image (blob)
    const imageBlob = await response.blob();
    
    // Convertir en base64 pour l'envoyer au client
    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      image: dataUrl,
      prompt,
      negativePrompt,
    });

  } catch (error) {
    console.error("Erreur génération image:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la génération" },
      { status: 500 }
    );
  }
}
