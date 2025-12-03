import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error("❌ TURSO_DATABASE_URL et TURSO_AUTH_TOKEN requis dans .env.local");
  process.exit(1);
}

async function migrate() {
  console.log("🚀 Connexion à Turso production...");
  console.log(`📍 URL: ${TURSO_DATABASE_URL}`);

  const client = createClient({
    url: TURSO_DATABASE_URL!,
    authToken: TURSO_AUTH_TOKEN!,
  });

  try {
    // Vérifier la connexion
    console.log("\n✅ Connexion établie");

    // Vérifier si les colonnes existent déjà
    console.log("\n🔍 Vérification de l'état actuel de la table Video...");
    const tableInfo = await client.execute("PRAGMA table_info(Video)");
    const columns = tableInfo.rows.map((row: any) => row.name);
    
    console.log("📋 Colonnes actuelles:", columns);

    const hasCreatedBy = columns.includes("createdBy");
    const hasIsPublic = columns.includes("isPublic");

    if (hasCreatedBy && hasIsPublic) {
      console.log("\n✅ Les migrations sont déjà appliquées !");
      console.log("   - createdBy: ✓");
      console.log("   - isPublic: ✓");
      return;
    }

    console.log("\n📝 Application des migrations...");

    // Migration 1: Ajouter createdBy
    if (!hasCreatedBy) {
      console.log("\n1️⃣ Ajout de la colonne createdBy...");
      
      await client.batch([
        // Créer une nouvelle table avec la colonne
        `CREATE TABLE "new_Video" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "type" TEXT NOT NULL DEFAULT 'video',
          "duration" INTEGER NOT NULL,
          "views" INTEGER NOT NULL DEFAULT 0,
          "isHd" INTEGER NOT NULL DEFAULT 0,
          "coverUrl" TEXT NOT NULL,
          "videoUrl" TEXT,
          "performer" TEXT NOT NULL,
          "ageBadge" TEXT,
          "categoryId" INTEGER NOT NULL,
          "createdBy" TEXT,
          "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TEXT NOT NULL,
          FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
          FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
        )`,
        
        // Copier les données
        `INSERT INTO "new_Video" 
         SELECT id, title, type, duration, views, isHd, coverUrl, videoUrl, 
                performer, ageBadge, categoryId, NULL as createdBy, 
                createdAt, updatedAt 
         FROM "Video"`,
        
        // Supprimer l'ancienne table
        `DROP TABLE "Video"`,
        
        // Renommer la nouvelle table
        `ALTER TABLE "new_Video" RENAME TO "Video"`,
        
        // Créer l'index
        `CREATE INDEX "Video_createdBy_idx" ON "Video"("createdBy")`,
      ], "write");

      console.log("   ✅ Colonne createdBy ajoutée");
    }

    // Migration 2: Ajouter isPublic
    if (!hasIsPublic) {
      console.log("\n2️⃣ Ajout de la colonne isPublic...");
      
      await client.batch([
        // Créer une nouvelle table avec la colonne
        `CREATE TABLE "new_Video" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "type" TEXT NOT NULL DEFAULT 'video',
          "duration" INTEGER NOT NULL,
          "views" INTEGER NOT NULL DEFAULT 0,
          "isHd" INTEGER NOT NULL DEFAULT 0,
          "coverUrl" TEXT NOT NULL,
          "videoUrl" TEXT,
          "performer" TEXT NOT NULL,
          "ageBadge" TEXT,
          "categoryId" INTEGER NOT NULL,
          "createdBy" TEXT,
          "isPublic" INTEGER NOT NULL DEFAULT 1,
          "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TEXT NOT NULL,
          FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
          FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
        )`,
        
        // Copier les données
        `INSERT INTO "new_Video" 
         SELECT id, title, type, duration, views, isHd, coverUrl, videoUrl, 
                performer, ageBadge, categoryId, createdBy, 1 as isPublic,
                createdAt, updatedAt 
         FROM "Video"`,
        
        // Supprimer l'ancienne table
        `DROP TABLE "Video"`,
        
        // Renommer la nouvelle table
        `ALTER TABLE "new_Video" RENAME TO "Video"`,
        
        // Recréer l'index
        `CREATE INDEX "Video_createdBy_idx" ON "Video"("createdBy")`,
      ], "write");

      console.log("   ✅ Colonne isPublic ajoutée");
    }

    console.log("\n🎉 Migrations appliquées avec succès !");
    console.log("\n📊 Vérification finale...");
    
    const finalTableInfo = await client.execute("PRAGMA table_info(Video)");
    const finalColumns = finalTableInfo.rows.map((row: any) => row.name);
    console.log("📋 Colonnes finales:", finalColumns);

  } catch (error) {
    console.error("\n❌ Erreur lors de la migration:", error);
    process.exit(1);
  } finally {
    client.close();
  }
}

migrate();
