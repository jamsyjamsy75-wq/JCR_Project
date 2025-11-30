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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier");
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

      alert("Média uploadé avec succès !");
      
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
      alert("Erreur lors de l'upload");
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

      alert("Média supprimé !");
      loadMedias();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
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
                  className="w-full rounded bg-night p-3 text-white"
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
                  className="w-full rounded bg-night p-3 text-white"
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
                  className="w-full rounded bg-night p-3 text-white"
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
                  className="w-full rounded bg-night p-3 text-white"
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
                  className="w-full rounded bg-night p-3 text-white"
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
                  className="w-full rounded bg-night p-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Badge d'âge
                </label>
                <input
                  type="text"
                  value={formData.ageBadge}
                  onChange={(e) =>
                    setFormData({ ...formData, ageBadge: e.target.value })
                  }
                  placeholder="18+, XR, 4K..."
                  className="w-full rounded bg-night p-3 text-white"
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
                  className="mr-2"
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
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Catégorie</th>
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
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto,w_200/${media.coverUrl}`}
                          alt={media.title}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4">{media.title}</td>
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
                    <td className="py-4">{media.category.name}</td>
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
