import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const canonicalUrl = "https://xburncrust.vercel.app";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AdultEntertainment",
  name: "xburncrust – LustLeak FR",
  url: canonicalUrl,
  image:
    "https://res.cloudinary.com/demo/image/upload/v1720000000/xburncrust/cover.webp",
  description:
    "xburncrust diffuse les leaks NSFW français en 4K : lives interdits, studios underground, performers indépendants.",
  inLanguage: "fr-FR",
  publisher: {
    "@type": "Organization",
    name: "xburncrust",
    logo: `${canonicalUrl}/media/lustleak-logo.svg`,
  },
  potentialAction: [
    {
      "@type": "ViewAction",
      target: `${canonicalUrl}/#hero`,
      name: "Regarder maintenant",
    },
    {
      "@type": "RegisterAction",
      target: `${canonicalUrl}/#signup`,
      name: "Créer un compte",
    },
  ],
  isFamilyFriendly: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: "xburncrust | LustLeak FR – Le hub NSFW ultime",
  description:
    "Rejoins xburncrust : leaks 4K, lives interdits, studios extrêmes. Header néon, filtres et grille masonry identiques à BornToBeFuck.",
  alternates: {
    canonical: canonicalUrl,
    languages: {
      fr: canonicalUrl,
      en: `${canonicalUrl}/en`,
    },
  },
  openGraph: {
    type: "website",
    url: canonicalUrl,
    title: "xburncrust – LustLeak FR",
    description:
      "Une copie moderne de BornToBeFuck avec Next.js 15, Tailwind et CDN Cloudinary.",
    images: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1720000000/xburncrust/og-cover.webp",
        width: 1200,
        height: 630,
        alt: "xburncrust OG preview",
      },
    ],
    siteName: "xburncrust",
  },
  twitter: {
    card: "summary_large_image",
    title: "xburncrust – LustLeak FR",
    description:
      "Landing page NSFW ultime avec hero vidéo, filtres et feed infini.",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1720000000/xburncrust/og-cover.webp",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: "adult",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-night font-sans text-white antialiased">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

