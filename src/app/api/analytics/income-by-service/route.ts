import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Función para formatear YYYY-MM (nombre de mes)
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { service: true },
    });

    // Agrupar por mes → servicio → total
    const result: Record<string, Record<string, number>> = {};

    appointments.forEach((a) => {
      if (!a.date) return;

      const d = new Date(a.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthName = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

      if (!result[key]) result[key] = { month: monthName };

      const service = a.service?.name ?? "Sin servicio";
      const price = a.servicePrice ?? a.service?.price ?? 0;

      result[key][service] = (result[key][service] ?? 0) + price;
    });

    // Convertir en array ordenado
    const final = Object.values(result);

    return NextResponse.json(final);
  } catch (error) {
    console.error("ERROR INCOME BY SERVICE:", error);
    return NextResponse.json({ error: "Error generating analytics" }, { status: 500 });
  }
}
