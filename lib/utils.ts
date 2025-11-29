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
  // En dev, utiliser l'API route local-media
  const useLocalMedia = process.env.NEXT_PUBLIC_USE_LOCAL_MEDIA === "true";
  
  if (useLocalMedia) {
    // Extraire le chemin depuis le Public ID
    // "lustleak/media/Photo_IA/image" → "Photo_IA/image"
    const pathParts = publicId.split("/");
    const mediaIndex = pathParts.indexOf("media");
    const relativePath = pathParts.slice(mediaIndex + 1).join("/");
    
    // Mapping des extensions
    const extensionMap: Record<string, string> = {
      "00021-387966325": "png",
      "32722bf5-cc39-4ef8-9902-5ad7c0b54531": "png",
      "image_comfyui": "png",
      "videoframe_1064": "png",
      "videoframe_1572": "png",
      "krxuhbux4rrvdi4cdujo": "jpg",
    };
    
    const fileName = pathParts[pathParts.length - 1];
    const ext = extensionMap[fileName] || (resourceType === "video" ? "mp4" : "png");
    
    return `/api/local-media/${relativePath}.${ext}`;
  }
  
  // En production, utiliser Cloudinary
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbtuww2ie";
  const transformations = resourceType === "video" 
    ? "q_auto,f_auto" 
    : "q_auto,f_auto,w_800";
  
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformations}/${publicId}`;
};


