import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existing = await prisma.user.findUnique({
      where: { email: "Jamsy75@gmail.com" },
    });

    if (existing) {
      console.log("✅ Utilisateur existe déjà, mise à jour du rôle en admin...");
      await prisma.user.update({
        where: { email: "Jamsy75@gmail.com" },
        data: { role: "admin" },
      });
      console.log("✅ Rôle admin mis à jour !");
      return;
    }

    // Créer le nouvel admin
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    
    await prisma.user.create({
      data: {
        email: "Jamsy75@gmail.com",
        name: "Admin",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ Compte admin créé avec succès !");
    console.log("Email: Jamsy75@gmail.com");
    console.log("Password: Admin123!");
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
