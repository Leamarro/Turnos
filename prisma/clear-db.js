const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // ⚠️ borrar en orden por relaciones
  await prisma.appointment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();

  console.log("✅ Base limpia (datos borrados, tablas intactas)");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
