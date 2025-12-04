"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type GeneratedImage = {
  image: string;
  prompt: string;
  negativePrompt?: string;
};

export default function GenerateImagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("ugly, blurry, low quality, distorted, deformed");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [numSteps, setNumSteps] = useState(25); // Steps pour affiner la qualité
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);
  
  // Modal de sauvegarde
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [saveForm, setSaveForm] = useState({
    title: "",
    performer: "",
    categoryId: "",
    showOnHome: true, // Par défaut, afficher sur l'accueil
  });

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Erreur chargement catégories:", err);
      }
    };
    loadCategories();
  }, []);

  // Rediriger si pas admin
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    router.push("/");
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Veuillez entrer un prompt");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedImage(null);
    setRetryAfter(0);

    try {
      const res = await fetch("/api/admin/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          width,
          height,
          numSteps,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503 && data.retryAfter) {
          setRetryAfter(data.retryAfter);
          setError(`${data.error} Le modèle se charge...`);
        } else {
          setError(data.error || "Erreur lors de la génération");
        }
        return;
      }

      setGeneratedImage(data);
    } catch (err) {
      setError("Erreur réseau lors de la génération");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToMedia = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (!saveForm.title || !saveForm.performer || !saveForm.categoryId || !generatedImage) {
      setError("Tous les champs sont requis");
      return;
    }

    setSaveLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/save-generated-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: generatedImage.image,
          title: saveForm.title,
          performer: saveForm.performer,
          categoryId: saveForm.categoryId,
          showOnHome: saveForm.showOnHome,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la sauvegarde");
        return;
      }

      // Succès !
      alert("✅ Image sauvegardée avec succès !");
      setShowSaveModal(false);
      setSaveForm({ title: "", performer: "", categoryId: "", showOnHome: true });
      setGeneratedImage(null);

    } catch (err) {
      setError("Erreur réseau lors de la sauvegarde");
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">🎨 Générateur d&apos;images IA</h1>
          <button
            onClick={() => router.push("/admin/media")}
            className="rounded-lg bg-night-lighter px-6 py-3 transition hover:bg-white/10"
          >
            ← Retour à l&apos;admin
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulaire */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-night-lighter p-6">
              <h2 className="mb-4 text-xl font-semibold">Paramètres de génération</h2>

              {/* Prompt */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="beautiful woman, realistic, 4K, studio lighting..."
                  className="w-full rounded-lg border border-white/20 bg-obsidian p-3 text-white placeholder-white/40 focus:border-neon-pink focus:outline-none"
                  rows={4}
                />
              </div>

              {/* Negative Prompt */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Negative Prompt</label>
                <textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="ugly, blurry, low quality..."
                  className="w-full rounded-lg border border-white/20 bg-obsidian p-3 text-white placeholder-white/40 focus:border-neon-pink focus:outline-none"
                  rows={2}
                />
              </div>

              {/* Info automatique */}
              <div className="mb-4 rounded-lg border border-neon-pink/20 bg-neon-pink/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <div className="text-sm">
                    <p className="font-medium text-neon-pink">Sélection automatique du meilleur modèle</p>
                    <p className="mt-1 text-white/70">
                      Le système essaie automatiquement 5 modèles IA différents (FLUX.1-dev, FLUX.1-schnell, SD XL Turbo, Playground v2.5, Dreamshaper XL) pour garantir la meilleure qualité disponible.
                    </p>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Qualité de génération ({numSteps} steps) - Plus = meilleure qualité mais plus lent
                </label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={numSteps}
                  onChange={(e) => setNumSteps(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-white/50">
                  <span>Rapide (5)</span>
                  <span>Équilibré (25)</span>
                  <span>Max qualité (50)</span>
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Largeur</label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full rounded-lg border border-white/20 bg-obsidian p-3 text-white focus:border-neon-pink focus:outline-none"
                  >
                    <option value={512}>512px</option>
                    <option value={768}>768px</option>
                    <option value={1024}>1024px</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Hauteur</label>
                  <select
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-white/20 bg-obsidian p-3 text-white focus:border-neon-pink focus:outline-none"
                  >
                    <option value={512}>512px</option>
                    <option value={768}>768px</option>
                    <option value={1024}>1024px</option>
                  </select>
                </div>
              </div>

              {/* Bouton Generate */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="mt-6 w-full rounded-lg bg-neon-pink py-3 font-semibold transition hover:bg-neon-pink/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "⏳ Génération en cours..." : "✨ Générer l'image"}
              </button>

              {/* Info */}
              <p className="mt-4 text-xs text-white/60">
                🆓 100% Gratuit • ⏱️ ~10-60s (selon modèle) • 🔞 NSFW OK
              </p>

              {/* Retry info */}
              {retryAfter > 0 && (
                <p className="mt-2 text-sm text-yellow-400">
                  ⚠️ Réessayez dans {retryAfter} secondes (modèle en chargement)
                </p>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Prévisualisation */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-night-lighter p-6">
              <h2 className="mb-4 text-xl font-semibold">Résultat</h2>

              {!generatedImage && !loading && (
                <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-obsidian">
                  <p className="text-white/40">L&apos;image générée apparaîtra ici</p>
                </div>
              )}

              {loading && (
                <div className="flex aspect-square items-center justify-center rounded-lg bg-obsidian">
                  <div className="text-center">
                    <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-neon-pink border-t-transparent"></div>
                    <p className="text-white/60">Génération en cours...</p>
                    <p className="text-sm text-white/40">Cela peut prendre 30-60 secondes</p>
                  </div>
                </div>
              )}

              {generatedImage && (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image
                      src={generatedImage.image}
                      alt={generatedImage.prompt}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  <div className="rounded-lg bg-obsidian p-4">
                    <p className="mb-2 text-xs text-white/60">Prompt utilisé :</p>
                    <p className="text-sm text-white/90">{generatedImage.prompt}</p>
                  </div>

                  <button
                    onClick={handleSaveToMedia}
                    className="w-full rounded-lg bg-green-600 py-3 font-semibold transition hover:bg-green-700"
                  >
                    💾 Sauvegarder dans la médiathèque
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de sauvegarde */}
      {showSaveModal && generatedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-night-lighter p-6">
            <h3 className="mb-4 text-xl font-bold">💾 Sauvegarder l&apos;image</h3>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={saveForm.title}
                onChange={(e) => setSaveForm({ ...saveForm, title: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-obsidian p-3 text-white focus:border-neon-pink focus:outline-none"
                placeholder="Titre de l'image..."
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Performer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={saveForm.performer}
                onChange={(e) => setSaveForm({ ...saveForm, performer: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-obsidian p-3 text-white focus:border-neon-pink focus:outline-none"
                placeholder="Nom du performer..."
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                value={saveForm.categoryId}
                onChange={(e) => setSaveForm({ ...saveForm, categoryId: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-obsidian p-3 text-white focus:border-neon-pink focus:outline-none"
              >
                <option value="">Sélectionner une catégorie...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveForm.showOnHome}
                  onChange={(e) => setSaveForm({ ...saveForm, showOnHome: e.target.checked })}
                  className="h-5 w-5 cursor-pointer rounded border-white/20 bg-obsidian text-neon-pink focus:ring-2 focus:ring-neon-pink focus:ring-offset-0"
                />
                <span className="text-sm font-medium">
                  🏠 Afficher sur la page d&apos;accueil
                </span>
              </label>
              <p className="mt-1 ml-8 text-xs text-white/50">
                Si décoché, l&apos;image sera visible uniquement dans votre profil
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                disabled={saveLoading}
                className="flex-1 rounded-lg border border-white/20 bg-obsidian py-3 transition hover:bg-white/5 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={saveLoading || !saveForm.title || !saveForm.performer || !saveForm.categoryId}
                className="flex-1 rounded-lg bg-neon-pink py-3 font-semibold transition hover:bg-neon-pink/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saveLoading ? "Sauvegarde..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
