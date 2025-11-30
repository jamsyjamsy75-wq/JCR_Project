import { createPrismaClient } from '../prisma/seed';

async function checkMediaFormat() {
  const prisma = createPrismaClient();

  console.log('\n=== Anciennes données (seed) ===');
  const oldMedia = await prisma.video.findMany({
    where: {
      id: {
        startsWith: 'v-'
      }
    },
    take: 2,
    orderBy: { id: 'asc' }
  });
  
  oldMedia.forEach(media => {
    console.log(`\nID: ${media.id}`);
    console.log(`Title: ${media.title}`);
    console.log(`Type: ${media.type}`);
    console.log(`CoverUrl: ${media.coverUrl}`);
    console.log(`VideoUrl: ${media.videoUrl}`);
  });

  console.log('\n=== Nouvelles données (uploadées) ===');
  const newMedia = await prisma.video.findMany({
    where: {
      OR: [
        { id: { startsWith: 'video-' } },
        { id: { startsWith: 'photo-' } }
      ]
    },
    orderBy: { id: 'desc' }
  });
  
  newMedia.forEach(media => {
    console.log(`\nID: ${media.id}`);
    console.log(`Title: ${media.title}`);
    console.log(`Type: ${media.type}`);
    console.log(`CoverUrl: ${media.coverUrl}`);
    console.log(`VideoUrl: ${media.videoUrl}`);
  });

  await prisma.$disconnect();
}

checkMediaFormat();
