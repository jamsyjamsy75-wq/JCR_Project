import { CldImage, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Composant optimisé pour les images Cloudinary
 * Gère automatiquement le lazy loading, responsive, format optimal
 */
export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
}: CloudinaryImageProps) {
  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      crop="fill"
      gravity="auto"
      format="auto"
      quality="auto"
      loading="lazy"
    />
  );
}

interface CloudinaryVideoProps {
  src: string;
  width: number | string;
  height: number | string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

/**
 * Composant optimisé pour les vidéos Cloudinary
 * Player avec contrôles intégrés et streaming adaptatif
 */
export function CloudinaryVideo({
  src,
  width,
  height,
  className,
  autoplay = false,
  loop = false,
  muted = true,
}: CloudinaryVideoProps) {
  return (
    <CldVideoPlayer
      src={src}
      width={width}
      height={height}
      className={className}
      autoplay={autoplay}
      loop={loop}
      muted={muted}
      controls
      transformation={{
        streaming_profile: "auto",
        quality: "auto",
      }}
    />
  );
}
