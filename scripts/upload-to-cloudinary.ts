/**
 * Script de migration des médias vers Cloudinary
 * Usage: npm run cloudinary:upload
 * 
 * Avant de lancer:
 * 1. Créer un compte gratuit sur https://cloudinary.com
 * 2. Copier Cloud Name, API Key, API Secret depuis le Dashboard
 * 3. Créer un fichier .env.local avec:
 *    CLOUDINARY_CLOUD_NAME=votre_cloud_name
 *    CLOUDINARY_API_KEY=votre_api_key
 *    CLOUDINARY_API_SECRET=votre_api_secret
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
  localPath: string;
  cloudinaryUrl: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
}

const results: UploadResult[] = [];

/**
 * Upload un fichier vers Cloudinary
 */
async function uploadFile(
  filePath: string,
  folder: string
): Promise<UploadResult | null> {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const resourceType = [".mp4", ".webm", ".mov"].includes(ext)
      ? "video"
      : [".svg"].includes(ext)
      ? "raw"
      : "image";

    console.log(`📤 Upload: ${filePath}`);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: `lustleak/${folder}`,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
    });

    console.log(`✅ Uploadé: ${result.secure_url}`);

    return {
      localPath: filePath,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      resourceType,
    };
  } catch (error) {
    console.error(`❌ Erreur upload ${filePath}:`, error);
    return null;
  }
}

/**
 * Parcourt récursivement un dossier et upload les fichiers
 */
async function uploadDirectory(dirPath: string, folderName: string) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Récursif pour les sous-dossiers
      await uploadDirectory(fullPath, `${folderName}/${item}`);
    } else if (stat.isFile()) {
      const result = await uploadFile(fullPath, folderName);
      if (result) {
        results.push(result);
      }
    }
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log("🚀 Démarrage de la migration vers Cloudinary...\n");

  // Vérification de la config
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("❌ Variables d'environnement Cloudinary manquantes!");
    console.error("Ajoutez dans .env.local:");
    console.error("CLOUDINARY_CLOUD_NAME=...");
    console.error("CLOUDINARY_API_KEY=...");
    console.error("CLOUDINARY_API_SECRET=...");
    process.exit(1);
  }

  const mediaDir = path.join(__dirname, "..", "public", "media");

  if (!fs.existsSync(mediaDir)) {
    console.error(`❌ Dossier media introuvable: ${mediaDir}`);
    process.exit(1);
  }

  // Upload tous les médias
  await uploadDirectory(mediaDir, "media");

  console.log("\n✅ Migration terminée!");
  console.log(`📊 Total: ${results.length} fichiers uploadés\n`);

  // Génération du fichier de mapping
  const mappingPath = path.join(__dirname, "cloudinary-mapping.json");
  fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));

  console.log(`📝 Mapping sauvegardé: ${mappingPath}`);
  console.log("\n🎯 Prochaines étapes:");
  console.log("1. Mettre à jour lib/mediaCatalog.ts avec les nouvelles URLs");
  console.log("2. Mettre à jour les composants pour utiliser next-cloudinary");
  console.log("3. Optionnel: Supprimer le dossier public/media local\n");
}

main().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});
