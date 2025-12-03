import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { HfInference } from "@huggingface/inference";

// Forcer Node.js runtime (Hugging Face nécessite Node.js, pas Edge)
export const runtime = "nodejs";
export const maxDuration = 60; // 60 secondes max pour la génération

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

    const { 
      prompt, 
      negativePrompt, 
      width = 1024, 
      height = 1024,
      model = "dev", // "dev" ou "schnell"
      numSteps = 25
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Le prompt est requis" },
        { status: 400 }
      );
    }

    // Token Hugging Face (100% GRATUIT)
    const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;
    
    if (!HF_TOKEN) {
      console.error('❌ HUGGING_FACE_TOKEN manquant');
      return NextResponse.json(
        { error: "Token Hugging Face manquant dans .env" },
        { status: 500 }
      );
    }

    // Choisir le modèle selon la préférence
    let modelName: string;
    if (model === "dev") {
      modelName = "black-forest-labs/FLUX.1-dev"; // Meilleure qualité
    } else if (model === "sd15") {
      modelName = "runwayml/stable-diffusion-v1-5"; // Stable Diffusion 1.5
    } else {
      modelName = "black-forest-labs/FLUX.1-schnell"; // Plus rapide
    }

    console.log(`🎨 Génération avec ${modelName} (${numSteps} steps)...`);

    // Utiliser l'API Inference directe (pas de providers, vraiment gratuit)
    const apiUrl = `https://api-inference.huggingface.co/models/${modelName}`;
    
    console.log(`📡 Appel direct API: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt || "",
          width: width,
          height: height,
          num_inference_steps: numSteps,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur API HF (${response.status}):`, errorText);
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const result = await response.blob();

    console.log("📦 Type de résultat:", typeof result, result?.constructor?.name);

    // Convertir le Blob en base64
    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log(`✅ Image générée avec succès (${modelName}, ${numSteps} steps)`);

    return NextResponse.json({
      success: true,
      image: dataUrl,
      prompt,
      negativePrompt,
      model: modelName,
      steps: numSteps,
    });

  } catch (error: any) {
    console.error("❌ Erreur génération image:", error);
    console.error("❌ Message:", error?.message);
    console.error("❌ Stack:", error?.stack);
    console.error("❌ Response:", error?.response?.data);
    
    // Retourner des détails pour debug
    return NextResponse.json(
      { 
        error: "Erreur serveur lors de la génération",
        details: error?.message || "Erreur inconnue",
        type: error?.constructor?.name,
        // En dev, on retourne plus d'infos
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error?.stack,
          full: JSON.stringify(error, null, 2)
        })
      },
      { status: 500 }
    );
  }
}
