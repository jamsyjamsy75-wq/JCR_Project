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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclure les fichiers non-JS des packages libsql
      config.externals.push({
        '@libsql/client': '@libsql/client',
        '@prisma/adapter-libsql': '@prisma/adapter-libsql',
      });
    }
    
    // Ignorer les fichiers README/LICENSE dans le bundling
    config.module.rules.push({
      test: /\.(md|txt|LICENSE)$/,
      type: 'asset/source',
    });
    
    return config;
  },
};

export default nextConfig;


