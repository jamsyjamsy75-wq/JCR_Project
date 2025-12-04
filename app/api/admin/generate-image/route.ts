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
      numSteps = 25,
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Le prompt est requis" },
        { status: 400 }
      );
    }

    // Liste des 5 meilleurs modèles gratuits (par ordre de priorité)
    const availableModels = [
      { id: "flux-pro", name: "FLUX.1-dev", description: "Meilleure qualité" },
      { id: "flux", name: "FLUX.1-schnell", description: "Rapide" },
      { id: "turbo", name: "Stable Diffusion XL Turbo", description: "Très rapide" },
      { id: "playground-v2.5", name: "Playground v2.5", description: "Excellent pour portraits" },
      { id: "dreamshaper-xl", name: "Dreamshaper XL", description: "Bon compromis" },
    ];

    console.log(`🎨 Tentative de génération avec ${availableModels.length} modèles disponibles...`);

    const encodedPrompt = encodeURIComponent(prompt);
    const encodedNegative = negativePrompt ? encodeURIComponent(negativePrompt) : "";
    const randomSeed = Math.floor(Math.random() * 1000000);

    let lastError = null;
    let successModel = null;
    let imageBuffer = null;

    // Essayer chaque modèle un par un jusqu'à ce qu'un fonctionne
    for (const modelInfo of availableModels) {
      try {
        console.log(`📡 Essai avec ${modelInfo.name} (${modelInfo.id})...`);
        
        let apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${modelInfo.id}&width=${width}&height=${height}&seed=${randomSeed}&nologo=true&enhance=true`;
        
        if (encodedNegative) {
          apiUrl += `&negative=${encodedNegative}`;
        }
        
        const response = await fetch(apiUrl, {
          method: "GET",
          signal: AbortSignal.timeout(30000), // Timeout 30s
        });

        if (response.ok) {
          imageBuffer = await response.arrayBuffer();
          successModel = modelInfo;
          console.log(`✅ Succès avec ${modelInfo.name} !`);
          break; // Sortir de la boucle si succès
        } else {
          console.log(`⚠️ ${modelInfo.name} a échoué (${response.status}), passage au suivant...`);
          lastError = `HTTP ${response.status}`;
        }
      } catch (error: any) {
        console.log(`⚠️ ${modelInfo.name} a échoué (${error.message}), passage au suivant...`);
        lastError = error.message;
        continue; // Essayer le modèle suivant
      }
    }

    // Si aucun modèle n'a fonctionné
    if (!imageBuffer || !successModel) {
      throw new Error(`Tous les modèles ont échoué. Dernière erreur: ${lastError}`);
    }

    const buffer = Buffer.from(imageBuffer);
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log(`✅ Image générée avec succès avec ${successModel.name}`);

    return NextResponse.json({
      success: true,
      image: dataUrl,
      prompt,
      negativePrompt,
      model: successModel.name, // Retourner le nom du modèle qui a fonctionné
      modelId: successModel.id,
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
