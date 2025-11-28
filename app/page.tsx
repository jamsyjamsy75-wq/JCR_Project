"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import FilterBar from "@/components/FilterBar";
import VideoGrid from "@/components/VideoGrid";
import AgeGateModal from "@/components/AgeGateModal";
import Footer from "@/components/Footer";
import type { VideoCardModel } from "@/lib/utils";

const HomePage = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [videos, setVideos] = useState<VideoCardModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des catégories.");
        }

        const payload = await response.json();
        const names =
          payload?.data?.map((category: { name: string }) => category.name) ??
          [];

        setFilters(names);
        setActiveFilter((current) => current || names[0] || "");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error(err);
        setError("Impossible de charger les catégories.");
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!activeFilter) return;

    const controller = new AbortController();

    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params =
          activeFilter && activeFilter !== "Trending"
            ? new URLSearchParams({ category: activeFilter })
            : null;

        const url = params
          ? `/api/videos?${params.toString()}`
          : "/api/videos";

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des vidéos.");
        }

        const payload = await response.json();
        setVideos(payload?.data ?? []);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error(err);
        setError("Impossible de charger les vidéos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();

    return () => controller.abort();
  }, [activeFilter]);

  return (
    <>
      <AgeGateModal />
      <div className="bg-night text-white">
        <Header />
        <main className="pt-24">
          <HeroVideo />
          <section className="mx-auto max-w-7xl px-6 py-16" id="feed">
            {filters.length > 0 ? (
              <FilterBar
                filters={filters}
                value={activeFilter}
                onChange={setActiveFilter}
              />
            ) : (
              <p className="mb-10 text-center text-sm uppercase tracking-[0.5em] text-white/50">
                Chargement des catégories…
              </p>
            )}

            {error && (
              <p className="mb-8 rounded-2xl border border-red-600/50 bg-red-600/10 px-4 py-3 text-center text-sm text-red-200">
                {error}
              </p>
            )}

            <VideoGrid
              key={`${activeFilter}-${videos.length}`}
              videos={videos}
              selectedFilter={activeFilter}
            />

            {isLoading && (
              <p className="mt-8 text-center text-xs uppercase tracking-[0.4em] text-white/60">
                Chargement…
              </p>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;

