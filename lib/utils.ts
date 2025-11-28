import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: Array<string | false | null | undefined>) => {
  return twMerge(clsx(inputs));
};

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
};

export const formatViews = (views: number) => {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1).replace(".0", "")} M`;
  }
  if (views >= 1_000) {
    return `${Math.round(views / 1_000)} k`;
  }
  return views.toString();
};

export type VideoCardModel = {
  id: string;
  title: string;
  category: string;
  duration: number;
  views: number;
  isHd: boolean;
  coverUrl: string;
  videoUrl: string | null;
  performer: string;
  ageBadge: string | null;
};

/**
 * Construit l'URL Cloudinary complète à partir du Public ID
 * @param publicId - Le Public ID Cloudinary (ex: "lustleak/media/Photo_IA/image")
 * @param resourceType - Type de ressource: "image" ou "video"
 */
export const getCloudinaryUrl = (
  publicId: string,
  resourceType: "image" | "video" = "image"
): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbtuww2ie";
  const transformations = resourceType === "video" 
    ? "q_auto,f_auto" 
    : "q_auto,f_auto,w_800";
  
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformations}/${publicId}`;
};


