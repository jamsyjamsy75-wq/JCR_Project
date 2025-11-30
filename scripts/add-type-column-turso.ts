import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

/**
 * Script pour ajouter la colonne `type` sur Turso (production)
 */
async function addTypeColumn() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("❌ TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN manquant");
    process.exit(1);
  }

  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    console.log("🔄 Ajout de la colonne 'type' sur Turso...");

    // Ajouter la colonne type avec valeur par défaut
    await turso.execute(`
      ALTER TABLE Video ADD COLUMN type TEXT NOT NULL DEFAULT 'video'
    `);

    console.log("✅ Colonne 'type' ajoutée avec succès");

    // Mettre à jour les photos (videoUrl = null)
    const photosResult = await turso.execute(`
      UPDATE Video SET type = 'photo' WHERE videoUrl IS NULL
    `);
    console.log(`✅ ${photosResult.rowsAffected} photos mises à jour`);

    // Mettre à jour les vidéos (videoUrl != null)
    const videosResult = await turso.execute(`
      UPDATE Video SET type = 'video' WHERE videoUrl IS NOT NULL
    `);
    console.log(`✅ ${videosResult.rowsAffected} vidéos mises à jour`);

    // Vérifier
    const stats = await turso.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN type = 'photo' THEN 1 ELSE 0 END) as photos,
        SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) as videos
      FROM Video
    `);

    console.log("\n📊 Résumé Turso:");
    console.log(`   Total: ${stats.rows[0].total}`);
    console.log(`   Photos: ${stats.rows[0].photos}`);
    console.log(`   Vidéos: ${stats.rows[0].videos}`);
  } catch (error: any) {
    if (error.message?.includes("duplicate column name")) {
      console.log("⚠️ La colonne 'type' existe déjà sur Turso");
      
      // Juste mettre à jour les types
      const photosResult = await turso.execute(`
        UPDATE Video SET type = 'photo' WHERE videoUrl IS NULL
      `);
      console.log(`✅ ${photosResult.rowsAffected} photos mises à jour`);

      const videosResult = await turso.execute(`
        UPDATE Video SET type = 'video' WHERE videoUrl IS NOT NULL
      `);
      console.log(`✅ ${videosResult.rowsAffected} vidéos mises à jour`);
    } else {
      console.error("❌ Erreur:", error);
    }
  } finally {
    turso.close();
  }
}

addTypeColumn();
