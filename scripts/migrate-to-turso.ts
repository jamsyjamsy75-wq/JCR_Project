/**
 * Script pour appliquer les migrations Prisma sur Turso
 * Usage: npx tsx scripts/migrate-to-turso.ts
 */

import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoToken) {
    console.error("❌ TURSO_DATABASE_URL et TURSO_AUTH_TOKEN requis dans .env.local");
    process.exit(1);
  }

  console.log("🚀 Connexion à Turso...\n");

  const client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });

  // Récupérer toutes les migrations
  const migrationsDir = path.join(__dirname, "..", "prisma", "migrations");
  const migrations = fs
    .readdirSync(migrationsDir)
    .filter((f) => fs.statSync(path.join(migrationsDir, f)).isDirectory())
    .sort();

  console.log(`📦 ${migrations.length} migration(s) trouvée(s):\n`);

  for (const migration of migrations) {
    const migrationPath = path.join(migrationsDir, migration, "migration.sql");

    if (!fs.existsSync(migrationPath)) {
      console.log(`⏭️  Pas de SQL pour ${migration}`);
      continue;
    }

    console.log(`⚙️  Application de ${migration}...`);

    const sql = fs.readFileSync(migrationPath, "utf-8");

    try {
      // Exécuter la migration
      await client.executeMultiple(sql);
      console.log(`✅ ${migration} appliquée avec succès\n`);
    } catch (error) {
      console.error(`❌ Erreur pour ${migration}:`, error);
      // Continuer même en cas d'erreur (la table existe peut-être déjà)
    }
  }

  console.log("\n🎉 Migration Turso terminée !\n");
  console.log("Prochaines étapes:");
  console.log("1. Ajouter TURSO_DATABASE_URL et TURSO_AUTH_TOKEN sur Vercel");
  console.log("2. Redéployer sur Vercel");
  console.log("3. Tester l'inscription/connexion en production\n");

  await client.close();
}

main().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});
