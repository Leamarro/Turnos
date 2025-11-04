import { prisma } from "@/lib/prisma";
import { CalendarGrid } from "@/components/CalendarGrid";

export default async function HomePage() {
  // 🔹 Consultamos los turnos desde la base
  const appointments = await prisma.appointment.findMany({
    include: {
      service: true,
      user: true,
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="py-6 sm:py-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        Agenda de Turnos
      </h1>
      {/* ✅ Pasamos los turnos como prop */}
      <CalendarGrid appointments={appointments} />
    </div>
  );
}
