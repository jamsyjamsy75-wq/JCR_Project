import { PrismaClient } from "@prisma/client";
import { mediaCategories, mediaVideos } from "../lib/mediaCatalog";

const prisma = new PrismaClient();

async function main() {
  await prisma.video.deleteMany();
  await prisma.category.deleteMany();

  const categoryMap = new Map<string, number>();

  for (const category of mediaCategories) {
    const created = await prisma.category.create({
      data: category,
    });
    categoryMap.set(category.name, created.id);
  }

  for (const video of mediaVideos) {
    const categoryId = categoryMap.get(video.category);
    if (!categoryId) continue;
    await prisma.video.create({
      data: {
        id: video.id,
        title: video.title,
        duration: video.duration,
        views: video.views,
        isHd: Boolean(video.isHd),
        coverUrl: video.coverUrl,
        videoUrl: video.videoUrl,
        performer: video.performer,
        ageBadge: video.ageBadge,
        categoryId,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("Erreur seed Prisma", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


