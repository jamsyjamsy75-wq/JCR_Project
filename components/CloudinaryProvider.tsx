import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

export default function NextCloudinaryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div vaul-drawer-wrapper="" className="bg-background">
        {children}
      </div>
    </>
  );
}
