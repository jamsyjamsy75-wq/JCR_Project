import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkDatabase() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    const result = await turso.execute(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN type = 'photo' THEN 1 ELSE 0 END) as photos,
             SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) as videos
      FROM Video
    `);

    console.log("\n📊 État actuel de Turso:");
    console.log(`   Total médias: ${result.rows[0].total}`);
    console.log(`   Photos: ${result.rows[0].photos}`);
    console.log(`   Vidéos: ${result.rows[0].videos}`);

    const recent = await turso.execute(`
      SELECT id, title, type, createdAt 
      FROM Video 
      ORDER BY createdAt DESC 
      LIMIT 5
    `);

    console.log("\n🆕 5 derniers médias:");
    recent.rows.forEach((row) => {
      console.log(`   - [${row.type}] ${row.title} (${row.id})`);
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    turso.close();
  }
}

checkDatabase();
