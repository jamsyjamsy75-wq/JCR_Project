import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

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

async function makeAdmin() {
  // Mettre l'utilisateur existant en admin
  const user = await prisma.user.update({
    where: { email: "Jamsy75@gmail.com" },
    data: { role: "admin" }
  });
  
  console.log("Utilisateur mis à jour:", user.email, "- Rôle:", user.role);
  await prisma.$disconnect();
}

makeAdmin();
