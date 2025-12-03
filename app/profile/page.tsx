import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";
import prisma from "@/lib/prisma";
import VideoCard from "@/components/VideoCard";
import { getCloudinaryUrl } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Récupérer les favoris de l'utilisateur
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      video: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  // Récupérer l'historique des vidéos vues
  const recentViews = await prisma.videoView.findMany({
    where: { userId: session.user.id },
    include: {
      video: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { viewedAt: "desc" },
    take: 12,
    distinct: ["videoId"],
  });

  // Récupérer les images générées par l'utilisateur
  // TODO: Réactiver après migration production avec createdBy
  const generatedImages: any[] = [];
  /*
  const generatedImages = await prisma.video.findMany({
    where: { 
      createdBy: session.user.id,
      type: "photo"
    },
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  */

  const favoriteVideos = favorites.map((fav) => ({
    id: fav.video.id,
    title: fav.video.title,
    category: fav.video.category.name,
    duration: fav.video.duration,
    views: fav.video.views,
    isHd: fav.video.isHd,
    coverUrl: fav.video.coverUrl,
    videoUrl: fav.video.videoUrl,
    performer: fav.video.performer,
    ageBadge: fav.video.ageBadge,
  }));

  const historyVideos = recentViews.map((view) => ({
    id: view.video.id,
    title: view.video.title,
    category: view.video.category.name,
    duration: view.video.duration,
    views: view.video.views,
    isHd: view.video.isHd,
    coverUrl: view.video.coverUrl,
    videoUrl: view.video.videoUrl,
    performer: view.video.performer,
    ageBadge: view.video.ageBadge,
  }));

  const myGeneratedImages = generatedImages.map((img) => ({
    id: img.id,
    title: img.title,
    category: img.category.name,
    duration: img.duration,
    views: img.views,
    isHd: img.isHd,
    coverUrl: img.coverUrl,
    videoUrl: img.videoUrl,
    performer: img.performer,
    ageBadge: img.ageBadge,
  }));

  return (
    <div className="min-h-screen bg-night text-white">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/70 backdrop-blur-2xl">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-sm uppercase tracking-[0.3em] text-white/70 transition hover:text-neon-pink"
              >
                ← Retour
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:border-red-500 hover:text-red-500"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-neon-pink/40 bg-gradient-to-b from-obsidian to-night p-10 shadow-glow">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-neon-pink to-red-600 text-3xl font-bold uppercase">
                {session.user.name?.[0] || session.user.email?.[0] || "U"}
              </div>
              <div className="flex-1">
                <h1 className="font-display text-4xl uppercase tracking-[0.3em] text-white">
                  {session.user.name || "Utilisateur"}
                </h1>
                <p className="mt-2 text-white/60">{session.user.email}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="rounded-full bg-neon-pink/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">
                    {session.user.role}
                  </span>
                  <span className="text-sm text-white/50">
                    {favorites.length} favoris • {recentViews.length} vues
                  </span>
                </div>
                <div className="mt-6">
                  <Link
                    href="/admin/generate"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-105 hover:shadow-purple-500/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    ✨ Generate Image IA
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Images Section */}
          <section className="mt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-3xl uppercase tracking-[0.3em] text-white">
                ✨ Mes Images Générées
              </h2>
              <Link
                href="/admin/generate"
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-glow transition hover:scale-105"
              >
                + Créer
              </Link>
            </div>
            {myGeneratedImages.length > 0 ? (
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                {myGeneratedImages.map((img) => (
                  <VideoCard key={img.id} video={img} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-12 text-center">
                <p className="mb-2 text-4xl">🎨</p>
                <p className="text-white/60">
                  Vous n&apos;avez pas encore créé d&apos;images avec l&apos;IA.
                </p>
                <Link
                  href="/admin/generate"
                  className="mt-4 inline-block rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-105"
                >
                  ✨ Générer ma première image
                </Link>
              </div>
            )}
          </section>

          {/* Favorites Section */}
          <section className="mt-16">
            <h2 className="mb-8 font-display text-3xl uppercase tracking-[0.3em] text-white">
              Mes Favoris
            </h2>
            {favoriteVideos.length > 0 ? (
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                {favoriteVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-obsidian p-12 text-center">
                <p className="text-white/60">
                  Aucun favori pour le moment. Explorez les vidéos pour en
                  ajouter !
                </p>
                <Link
                  href="/#feed"
                  className="mt-4 inline-block rounded-full bg-gradient-to-r from-neon-pink to-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-105"
                >
                  Explorer
                </Link>
              </div>
            )}
          </section>

          {/* History Section */}
          <section className="mt-16">
            <h2 className="mb-8 font-display text-3xl uppercase tracking-[0.3em] text-white">
              Historique Récent
            </h2>
            {historyVideos.length > 0 ? (
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                {historyVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-obsidian p-12 text-center">
                <p className="text-white/60">Aucune vidéo vue récemment.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
