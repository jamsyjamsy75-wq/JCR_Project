"use client";

import { useEffect, useRef, useState } from "react";
import VideoCard from "./VideoCard";
import LoadMoreButton from "./LoadMoreButton";
import type { VideoCardModel } from "@/lib/utils";

type VideoGridProps = {
  videos: VideoCardModel[];
  selectedFilter?: string;
};

const VideoGrid = ({ videos, selectedFilter }: VideoGridProps) => {
  const [visibleCount, setVisibleCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredVideos =
    selectedFilter && selectedFilter !== "Trending"
      ? videos.filter((video) => video.category === selectedFilter)
      : videos;

  // Reset visible count when filter changes - done in separate effect with dependency
  useEffect(() => {
    const timer = setTimeout(() => setVisibleCount(12), 0);
    return () => clearTimeout(timer);
  }, [selectedFilter]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) =>
              Math.min(prev + 8, filteredVideos.length)
            );
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [sentinelRef, filteredVideos.length]);

  const displayed = filteredVideos.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredVideos.length));
  };

  return (
    <section className="space-y-10">
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {displayed.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      {visibleCount < filteredVideos.length && (
        <div className="flex flex-col items-center gap-6">
          <LoadMoreButton onClick={handleLoadMore} />
          <div ref={sentinelRef} className="h-1 w-full opacity-0" />
        </div>
      )}
    </section>
  );
};

export default VideoGrid;

