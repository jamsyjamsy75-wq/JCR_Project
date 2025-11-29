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
  // En développement local, utiliser les fichiers du dossier public
  const isDev = process.env.NODE_ENV === "development";
  
  if (isDev) {
    // Extraire le nom du fichier depuis le Public ID Cloudinary
    // Format: "lustleak/media/Photo_IA/filename" ou "lustleak/media/Vidéo_IA/filename"
    const cloudinaryFileName = publicId.split("/").pop() || publicId;
    
    // Mapping Cloudinary Public ID → Nom de fichier local
    const localFileMap: Record<string, string> = {
      // Images
      "00021-387966325": "00021-387966325.png",
      "32722bf5-cc39-4ef8-9902-5ad7c0b54531": "32722bf5-cc39-4ef8-9902-5ad7c0b54531.png",
      "image_comfyui": "image_comfyui.png",
      "videoframe_1064": "videoframe_1064.png",
      "videoframe_1572": "videoframe_1572.png",
      "krxuhbux4rrvdi4cdujo": "téléchargement (21).jpg", // Renommé par Cloudinary
      // Vidéos
      "Boobs1": "Boobs1.mp4",
      "grok-video-0d3de9c3-9c8c-42f1-a6f8-bd01be929e27_2": "grok-video-0d3de9c3-9c8c-42f1-a6f8-bd01be929e27 (2).mp4",
      "grok-video-1ea24980-6370-4907-9084-beed76a14d47-5": "grok-video-1ea24980-6370-4907-9084-beed76a14d47-5.mp4",
      "grok-video-39d8b128-7fb7-4f14-a76d-f4d65f2ab4d2_1": "grok-video-39d8b128-7fb7-4f14-a76d-f4d65f2ab4d2 (1).mp4",
      "grok-video-6f08d131-cb90-497c-ae00-06e29f555f81": "grok-video-6f08d131-cb90-497c-ae00-06e29f555f81.mp4",
      "grok-video-71b88988-446e-4861-9c70-d313e79a92c9": "grok-video-71b88988-446e-4861-9c70-d313e79a92c9.mp4",
      "grok-video-c1455632-29db-437d-869c-113540a0f0b5": "grok-video-c1455632-29db-437d-869c-113540a0f0b5.mp4",
      "grok-video-cb845b0d-6249-4f52-9d3e-b7575ab4a9f8-4": "grok-video-cb845b0d-6249-4f52-9d3e-b7575ab4a9f8-4.mp4",
      "SM1": "SM1.mp4",
      "SM2": "SM2.mp4",
      "SM3": "SM3.mp4",
      "111871756": "111871756.mp4",
    };
    
    const localFileName = localFileMap[cloudinaryFileName] || `${cloudinaryFileName}.${resourceType === "video" ? "mp4" : "png"}`;
    return `/media/${resourceType === "video" ? "Vidéo_IA" : "Photo_IA"}/${localFileName}`;
  }
  
  // En production, utiliser Cloudinary
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbtuww2ie";
  const transformations = resourceType === "video" 
    ? "q_auto,f_auto" 
    : "q_auto,f_auto,w_800";
  
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformations}/${publicId}`;
};


