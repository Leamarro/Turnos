import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Primero borramos los turnos
  await prisma.appointment.deleteMany();

  // 2️⃣ Luego los servicios
  await prisma.service.deleteMany();

  // 3️⃣ Creamos los nuevos servicios
  await prisma.service.createMany({
    data: [
      { name: "Maquillaje", duration: 60, price: 10000 },
      { name: "Perfilado", duration: 30, price: 6000 },
    ],
  });

  console.log("✅ Servicios cargados correctamente");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
