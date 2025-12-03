import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Forcer Node.js runtime
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

    // Choisir le modèle FLUX selon la préférence
    // flux-pro = FLUX.1-dev (meilleure qualité)
    // flux = FLUX.1-schnell (rapide)
    const pollinationsModel = model === "dev" ? "flux-pro" : "flux";

    console.log(`🎨 Génération avec Pollinations.ai (${pollinationsModel})...`);

    // Pollinations.ai - 100% gratuit, illimité, utilise FLUX
    // API: https://image.pollinations.ai/prompt/{prompt}?model={model}&width={width}&height={height}
    const encodedPrompt = encodeURIComponent(prompt);
    const encodedNegative = negativePrompt ? encodeURIComponent(negativePrompt) : "";
    
    let apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${pollinationsModel}&width=${width}&height=${height}&nologo=true&enhance=true`;
    
    if (encodedNegative) {
      apiUrl += `&negative=${encodedNegative}`;
    }
    
    console.log(`📡 Appel Pollinations API...`);
    
    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log(`✅ Image générée avec succès (${pollinationsModel})`);

    return NextResponse.json({
      success: true,
      image: dataUrl,
      prompt,
      negativePrompt,
      model: pollinationsModel,
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
