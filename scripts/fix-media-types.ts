import { createPrismaClient } from '../prisma/seed';

async function fixPhotoTypes() {
  const prisma = createPrismaClient();

  console.log('Correction des types de médias...\n');

  // Les photos ont videoUrl = null
  const photosUpdated = await prisma.video.updateMany({
    where: {
      videoUrl: null
    },
    data: {
      type: 'photo'
    }
  });

  console.log(`✅ ${photosUpdated.count} photos mises à jour (type: "photo")`);

  // Les vidéos ont videoUrl non null
  const videosUpdated = await prisma.video.updateMany({
    where: {
      videoUrl: { not: null }
    },
    data: {
      type: 'video'
    }
  });

  console.log(`✅ ${videosUpdated.count} vidéos mises à jour (type: "video")`);

  await prisma.$disconnect();
}

fixPhotoTypes();
