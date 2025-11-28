/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    turbo: {
      rules: {
        "*.ts": {
          loaders: ["ts-loader"],
        },
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.bunny.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;


