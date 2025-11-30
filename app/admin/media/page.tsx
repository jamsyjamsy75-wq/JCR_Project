"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MediaItem = {
  id: string;
  title: string;
  type: string;
  duration: number;
  views: number;
  isHd: boolean;
  coverUrl: string;
  videoUrl: string | null;
  performer: string;
  ageBadge: string | null;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminMediaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [medias, setMedias] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  
  // Formulaire d'upload
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [formData, setFormData] = useState({
    title: "",
    type: "video",
    duration: 0,
    isHd: true,
    performer: "",
    ageBadge: "",
    categoryId: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      loadMedias();
      loadCategories();
    }
  }, [status, filterType]);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  const loadMedias = async () => {
    try {
      setLoading(true);
      const url = filterType === "all" 
        ? "/api/admin/media" 
        : `/api/admin/media?type=${filterType}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erreur chargement");
      
      const data = await res.json();
      setMedias(data.data || []);
    } catch (error) {
      console.error("Erreur chargement médias:", error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showNotification("Veuillez sélectionner un fichier", "error");
      return;
    }

    try {
      setUploading(true);

      // 1. Upload vers Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("type", formData.type);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) throw new Error("Erreur upload");

      const uploadData = await uploadRes.json();
      const publicId = uploadData.data.publicId;

      // 2. Créer l'entrée en BDD
      const mediaData = {
        ...formData,
        coverUrl: publicId,
        videoUrl: formData.type === "video" ? publicId : null,
        categoryId: parseInt(formData.categoryId),
      };

      const createRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mediaData),
      });

      if (!createRes.ok) throw new Error("Erreur création média");

      showNotification("✅ Média uploadé avec succès !", "success");
      
      // Reset form
      setFile(null);
      setFormData({
        title: "",
        type: "video",
        duration: 0,
        isHd: true,
        performer: "",
        ageBadge: "",
        categoryId: "",
      });
      
      loadMedias();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("❌ Erreur lors de l'upload", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce média ?")) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur suppression");

      showNotification("✅ Média supprimé !", "success");
      loadMedias();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("❌ Erreur lors de la suppression", "error");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night p-8">
      {/* Notification Popup */}
      {notification.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className={`animate-bounce-in rounded-lg border-2 px-8 py-6 shadow-2xl ${
              notification.type === "success"
                ? "border-neon-pink bg-gradient-to-br from-neon-pink/20 to-pink-500/10 shadow-neon-pink/50"
                : "border-red-500 bg-gradient-to-br from-red-500/20 to-red-700/10 shadow-red-500/50"
            }`}
          >
            <p
              className={`text-center text-xl font-bold ${
                notification.type === "success" ? "text-neon-pink" : "text-red-400"
              }`}
            >
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-neon-pink">
          Back-Office - Gestion des Médias
        </h1>

        {/* Formulaire d'upload */}
        <div className="mb-12 rounded-lg bg-night-lighter p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Ajouter un nouveau média
          </h2>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Type de média
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full rounded border border-neon-pink/30 bg-night p-3 text-white focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/20"
                >
                  <option value="video">Vidéo</option>
                  <option value="photo">Photo</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Fichier
                </label>
                <input
                  type="file"
                  accept={formData.type === "video" ? "video/*" : "image/*"}
                  onChange={handleFileChange}
                  className="w-full rounded border border-neon-pink/30 bg-night p-3 text-white file:mr-4 file:rounded file:border-0 file:bg-neon-pink/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-neon-pink/30 focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded border border-neon-pink/30 bg-night p-3 text-white placeholder:text-white/30 focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Catégorie
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full rounded border border-neon-pink/30 bg-night p-3 text-white focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/20"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Performer
                </label>
                <input
                  type="text"
                  value={formData.performer}
                  onChange={(e) =>
                    setFormData({ ...formData, performer: e.target.value })
                  }
                  className="w-full rounded border border-neon-pink/30 bg-night p-3 text-white placeholder:text-white/30 focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Durée (secondes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded border border-neon-pink/30 bg-night p-3 text-white placeholder:text-white/30 focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Badge d&apos;âge
                </label>
                <input
                  type="text"
                  value={formData.ageBadge}
                  onChange={(e) =>
                    setFormData({ ...formData, ageBadge: e.target.value })
                  }
                  placeholder="18+, XR, 4K..."
                  className="w-full rounded border border-neon-pink/30 bg-night p-3 text-white placeholder:text-white/30 focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/20"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isHd"
                  checked={formData.isHd}
                  onChange={(e) =>
                    setFormData({ ...formData, isHd: e.target.checked })
                  }
                  className="mr-2 h-5 w-5 rounded border-neon-pink/30 bg-night text-neon-pink focus:ring-2 focus:ring-neon-pink/20"
                />
                <label htmlFor="isHd" className="text-white/70">
                  HD
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full rounded bg-neon-pink px-6 py-3 font-semibold text-white hover:bg-neon-pink/80 disabled:opacity-50"
            >
              {uploading ? "Upload en cours..." : "Uploader le média"}
            </button>
          </form>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded px-6 py-2 ${
              filterType === "all"
                ? "bg-neon-pink text-white"
                : "bg-night-lighter text-white/70"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterType("video")}
            className={`rounded px-6 py-2 ${
              filterType === "video"
                ? "bg-neon-pink text-white"
                : "bg-night-lighter text-white/70"
            }`}
          >
            Vidéos
          </button>
          <button
            onClick={() => setFilterType("photo")}
            className={`rounded px-6 py-2 ${
              filterType === "photo"
                ? "bg-neon-pink text-white"
                : "bg-night-lighter text-white/70"
            }`}
          >
            Photos
          </button>
        </div>

        {/* Liste des médias */}
        <div className="rounded-lg bg-night-lighter p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Médias existants ({medias.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="pb-3">Aperçu</th>
                  <th className="pb-3">Titre</th>
                  <th className="pb-3">Upload date/heure</th>
                  <th className="pb-3">Catégorie</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Vues</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medias.map((media) => (
                  <tr key={media.id} className="border-b border-white/5">
                    <td className="py-4">
                      <div className="relative h-16 w-24">
                        <Image
                          src={
                            media.type === "video"
                              ? `https://res.cloudinary.com/dbtuww2ie/video/upload/q_auto,f_auto,w_200/${media.coverUrl}.jpg`
                              : `https://res.cloudinary.com/dbtuww2ie/image/upload/q_auto,f_auto,w_200/${media.coverUrl}`
                          }
                          alt={media.title}
                          fill
                          className="rounded object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="py-4">{media.title}</td>
                    <td className="py-4 text-sm text-white/60">
                      {new Date(media.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4">{media.category.name}</td>
                    <td className="py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          media.type === "video"
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {media.type}
                      </span>
                    </td>
                    <td className="py-4">{media.views.toLocaleString()}</td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDelete(media.id)}
                        className="rounded bg-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/30"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {medias.length === 0 && (
            <p className="py-8 text-center text-white/50">
              Aucun média trouvé
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
