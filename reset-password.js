import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

function createPrismaClient() {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}

const prisma = createPrismaClient();

async function resetPassword() {
  const newPassword = "Admin123!";
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const user = await prisma.user.update({
    where: { email: "Jamsy75@gmail.com" },
    data: { password: hashedPassword }
  });
  
  console.log("✅ Mot de passe réinitialisé pour:", user.email);
  console.log("📧 Email: Jamsy75@gmail.com");
  console.log("🔑 Mot de passe: Admin123!");
  console.log("");
  console.log("⚠️ Changez ce mot de passe après la connexion !");
  
  await prisma.$disconnect();
}

resetPassword();
