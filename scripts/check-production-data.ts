import { createPrismaClient } from '../prisma/seed';

async function checkProductionData() {
  const prisma = createPrismaClient();

  console.log('\n=== Photos (videoUrl = null) ===');
  const photos = await prisma.video.findMany({
    where: {
      videoUrl: null
    },
    take: 3
  });
  
  photos.forEach(p => {
    console.log(`ID: ${p.id}`);
    console.log(`Title: ${p.title}`);
    console.log(`Type: ${p.type}`);
    console.log(`VideoUrl: ${p.videoUrl}`);
    console.log(`CoverUrl: ${p.coverUrl}`);
    console.log('---');
  });

  console.log('\n=== Vidéos (videoUrl EXISTS) ===');
  const videos = await prisma.video.findMany({
    where: {
      videoUrl: { not: null }
    },
    take: 3
  });
  
  videos.forEach(v => {
    console.log(`ID: ${v.id}`);
    console.log(`Title: ${v.title}`);
    console.log(`Type: ${v.type}`);
    console.log(`VideoUrl: ${v.videoUrl}`);
    console.log(`CoverUrl: ${v.coverUrl}`);
    console.log('---');
  });

  await prisma.$disconnect();
}

checkProductionData();
