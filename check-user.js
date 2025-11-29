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

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: "Jamsy75@gmail.com" }
  });
  
  if (user) {
    console.log("Utilisateur trouvé:");
    console.log("- Email:", user.email);
    console.log("- Nom:", user.name);
    console.log("- Rôle:", user.role);
    console.log("- A un mot de passe:", user.password ? "OUI" : "NON");
  } else {
    console.log("❌ Utilisateur NON trouvé dans Turso");
  }
  
  await prisma.$disconnect();
}

checkUser();
