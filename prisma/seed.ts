import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.service.createMany({
    data: [
      { name: "Maquillaje", price: 25000 },
      { name: "Perfilado", price: 8000 },
    ],
  });
}

main()
  .then(() => console.log("✅ Servicios creados"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
