/** @type {import("next").NextConfig} */
const nextConfig = {
  typedRoutes: true,
  serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql'],
  experimental: {
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
  webpack: (config) => {
    // Ignorer les fichiers non-code dans le bundling
    config.module.rules.push({
      test: /\.(md|txt)$/,
      type: 'asset/source',
    });
    
    config.ignoreWarnings = [
      { module: /node_modules\/@libsql/ },
      { module: /node_modules\/@prisma\/adapter-libsql/ },
    ];
    
    return config;
  },
};

export default nextConfig;


