import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        service: true,
      },
    });

    const result: Record<
      string,
      {
        month: string;
        [serviceName: string]: number | string;
      }
    > = {};

    const MONTHS = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    appointments.forEach((a) => {
      const d = new Date(a.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const monthName = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

      // Siempre inicializamos con el mes
      if (!result[key]) {
        result[key] = { month: monthName };
      }

      // Nombre del servicio
      const service = a.service?.name ?? "Sin servicio";

      // Precio
      const price = a.servicePrice ?? a.service?.price ?? 0;

      // Acumula ingresos por servicio
      result[key][service] = (result[key][service] as number ?? 0) + price;
    });

    const final = Object.values(result);

    return NextResponse.json(final);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error generando estadísticas" });
  }
}
