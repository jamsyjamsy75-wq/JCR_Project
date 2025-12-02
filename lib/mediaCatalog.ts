export type MediaCategory = {
  name: string;
  slug: string;
};

export type MediaVideo = {
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

export const mediaCategories: MediaCategory[] = [
  { name: "Trending", slug: "trending" },
  { name: "Nouveautés", slug: "nouveautes" },
];

// Cloudinary Public IDs (sans extension, utilisés par next-cloudinary)
const coverPaths = {
  muse: "lustleak/media/Photo_IA/00021-387966325",
  bloom: "lustleak/media/Photo_IA/32722bf5-cc39-4ef8-9902-5ad7c0b54531",
  chrome: "lustleak/media/Photo_IA/image_comfyui",
  velvet: "lustleak/media/Photo_IA/krxuhbux4rrvdi4cdujo",
  frameA: "lustleak/media/Photo_IA/videoframe_1064",
  frameB: "lustleak/media/Photo_IA/videoframe_1572",
} as const;

const videoPaths = {
  neonLux: "lustleak/media/Vidéo_IA/Boobs1",
  glitchRush: "lustleak/media/Vidéo_IA/grok-video-0d3de9c3-9c8c-42f1-a6f8-bd01be929e27_2",
  duoPulse: "lustleak/media/Vidéo_IA/grok-video-1ea24980-6370-4907-9084-beed76a14d47-5",
  loftHeat: "lustleak/media/Vidéo_IA/grok-video-39d8b128-7fb7-4f14-a76d-f4d65f2ab4d2_1",
  chromeDive: "lustleak/media/Vidéo_IA/grok-video-6f08d131-cb90-497c-ae00-06e29f555f81",
  vrBloom: "lustleak/media/Vidéo_IA/grok-video-71b88988-446e-4861-9c70-d313e79a92c9",
  latexFlux: "lustleak/media/Vidéo_IA/grok-video-c1455632-29db-437d-869c-113540a0f0b5",
  neonDuet: "lustleak/media/Vidéo_IA/grok-video-cb845b0d-6249-4f52-9d3e-b7575ab4a9f8-4",
  sm1: "lustleak/media/Vidéo_IA/SM1",
  sm2: "lustleak/media/Vidéo_IA/SM2",
  sm3: "lustleak/media/Vidéo_IA/SM3",
} as const;

const trendingPhotos: MediaVideo[] = [
  {
    id: "trend-photo-01",
    title: "Muse incendiaire",
    category: "Trending",
    duration: 210,
    views: 118000,
    isHd: true,
    coverUrl: coverPaths.muse,
    videoUrl: null,
    performer: "XBURN Studio",
    ageBadge: null,
  },
  {
    id: "trend-photo-02",
    title: "Cyber Bloom ritual",
    category: "Trending",
    duration: 195,
    views: 104000,
    isHd: true,
    coverUrl: coverPaths.bloom,
    videoUrl: null,
    performer: "Delta Crew",
    ageBadge: null,
  },
  {
    id: "trend-photo-03",
    title: "Chrome siren freeze",
    category: "Trending",
    duration: 185,
    views: 98000,
    isHd: true,
    coverUrl: coverPaths.chrome,
    videoUrl: null,
    performer: "Nox Empire",
    ageBadge: null,
  },
  {
    id: "trend-photo-04",
    title: "Velvet pulse relic",
    category: "Trending",
    duration: 176,
    views: 91000,
    isHd: true,
    coverUrl: coverPaths.velvet,
    videoUrl: null,
    performer: "Sia & Saya",
    ageBadge: null,
  },
  {
    id: "trend-photo-05",
    title: "Studio Amber leak",
    category: "Trending",
    duration: 204,
    views: 87000,
    isHd: true,
    coverUrl: coverPaths.frameA,
    videoUrl: null,
    performer: "Léa + Chloé",
    ageBadge: null,
  },
  {
    id: "trend-photo-06",
    title: "Glitch rose apparition",
    category: "Trending",
    duration: 192,
    views: 94000,
    isHd: true,
    coverUrl: coverPaths.frameB,
    videoUrl: null,
    performer: "Mistress Kaia",
    ageBadge: null,
  },
];

const trendingVideos: MediaVideo[] = [
  {
    id: "trend-video-01",
    title: "Neon lux backstage",
    category: "Trending",
    duration: 422,
    views: 164000,
    isHd: true,
    coverUrl: coverPaths.muse,
    videoUrl: videoPaths.neonLux,
    performer: "Romy Blaze",
    ageBadge: "18+",
  },
  {
    id: "trend-video-02",
    title: "Glitch rush latex",
    category: "Trending",
    duration: 398,
    views: 152000,
    isHd: true,
    coverUrl: coverPaths.bloom,
    videoUrl: videoPaths.glitchRush,
    performer: "Vesper Noire",
    ageBadge: "18+",
  },
  {
    id: "trend-video-03",
    title: "Duo pulse immersion",
    category: "Trending",
    duration: 436,
    views: 133000,
    isHd: true,
    coverUrl: coverPaths.chrome,
    videoUrl: videoPaths.duoPulse,
    performer: "Sia & Saya",
    ageBadge: "18+",
  },
  {
    id: "trend-video-04",
    title: "Loft heat amateurs",
    category: "Trending",
    duration: 455,
    views: 87000,
    isHd: true,
    coverUrl: coverPaths.velvet,
    videoUrl: videoPaths.loftHeat,
    performer: "Léa + Chloé",
    ageBadge: "18+",
  },
  {
    id: "trend-video-05",
    title: "Chrome dive VR",
    category: "Trending",
    duration: 512,
    views: 201000,
    isHd: true,
    coverUrl: coverPaths.frameA,
    videoUrl: videoPaths.chromeDive,
    performer: "Nox Empire",
    ageBadge: "XR",
  },
  {
    id: "trend-video-06",
    title: "VR bloom tactile",
    category: "Trending",
    duration: 498,
    views: 118000,
    isHd: true,
    coverUrl: coverPaths.frameB,
    videoUrl: videoPaths.vrBloom,
    performer: "XR Girls",
    ageBadge: "XR",
  },
  {
    id: "trend-video-07",
    title: "Latex flux cathedral",
    category: "Trending",
    duration: 612,
    views: 189000,
    isHd: true,
    coverUrl: coverPaths.muse,
    videoUrl: videoPaths.latexFlux,
    performer: "Mistress Kaia",
    ageBadge: "XR",
  },
  {
    id: "trend-video-08",
    title: "Neon duet ritual",
    category: "Trending",
    duration: 540,
    views: 114000,
    isHd: true,
    coverUrl: coverPaths.bloom,
    videoUrl: videoPaths.neonDuet,
    performer: "Liv + Maë",
    ageBadge: "18+",
  },
  {
    id: "trend-video-09",
    title: "SM pulse I",
    category: "Trending",
    duration: 488,
    views: 82000,
    isHd: true,
    coverUrl: coverPaths.chrome,
    videoUrl: videoPaths.sm1,
    performer: "Nova Squad",
    ageBadge: "18+",
  },
  {
    id: "trend-video-10",
    title: "SM pulse II",
    category: "Trending",
    duration: 520,
    views: 79000,
    isHd: true,
    coverUrl: coverPaths.velvet,
    videoUrl: videoPaths.sm2,
    performer: "Lou + Jade",
    ageBadge: "18+",
  },
  {
    id: "trend-video-11",
    title: "SM pulse III",
    category: "Trending",
    duration: 560,
    views: 88000,
    isHd: true,
    coverUrl: coverPaths.frameA,
    videoUrl: videoPaths.sm3,
    performer: "Studio Hydra",
    ageBadge: "4K",
  },
];

const nouveautesEntries: MediaVideo[] = [
  {
    id: "new-photo-01",
    title: "Néo affiche holographique",
    category: "Nouveautés",
    duration: 188,
    views: 64000,
    isHd: true,
    coverUrl: coverPaths.muse,
    videoUrl: null,
    performer: "XBURN Lab",
    ageBadge: null,
  },
  {
    id: "new-photo-02",
    title: "Velvet bloom éditorial",
    category: "Nouveautés",
    duration: 176,
    views: 52000,
    isHd: true,
    coverUrl: coverPaths.velvet,
    videoUrl: null,
    performer: "Muse 404",
    ageBadge: null,
  },
  {
    id: "new-video-01",
    title: "Pole vr introduction",
    category: "Nouveautés",
    duration: 402,
    views: 72000,
    isHd: true,
    coverUrl: coverPaths.chrome,
    videoUrl: videoPaths.duoPulse,
    performer: "Sia & Saya",
    ageBadge: "18+",
  },
  {
    id: "new-video-02",
    title: "Glitch latex preview",
    category: "Nouveautés",
    duration: 376,
    views: 81000,
    isHd: true,
    coverUrl: coverPaths.frameB,
    videoUrl: videoPaths.glitchRush,
    performer: "Mistress Kaia",
    ageBadge: "18+",
  },
];

export const mediaVideos: MediaVideo[] = [
  ...trendingPhotos,
  ...trendingVideos,
  ...nouveautesEntries,
];

export const normalizeCategorySlug = (value?: string | null) => {
  if (!value) return null;
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};


