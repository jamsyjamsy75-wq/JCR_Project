import { createPrismaClient } from "./seed";

/**
 * Script pour mettre à jour le champ `type` des médias existants
 * Les médias avec videoUrl = null sont des photos
 * Les médias avec videoUrl != null sont des vidéos
 */
async function updateMediaTypes() {
  const prisma = createPrismaClient();

  try {
    console.log("🔄 Mise à jour des types de médias...");

    // Mettre à jour les photos (videoUrl = null)
    const photosUpdated = await prisma.video.updateMany({
      where: { videoUrl: null },
      data: { type: "photo" },
    });

    console.log(`✅ ${photosUpdated.count} photos mises à jour`);

    // Mettre à jour les vidéos (videoUrl != null)
    const videosUpdated = await prisma.video.updateMany({
      where: { 
        videoUrl: { not: null } 
      },
      data: { type: "video" },
    });

    console.log(`✅ ${videosUpdated.count} vidéos mises à jour`);

    // Afficher le résumé
    const photos = await prisma.video.count({ where: { type: "photo" } });
    const videos = await prisma.video.count({ where: { type: "video" } });
    const total = await prisma.video.count();

    console.log("\n📊 Résumé:");
    console.log(`   Photos: ${photos}`);
    console.log(`   Vidéos: ${videos}`);
    console.log(`   Total: ${total}`);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMediaTypes();
