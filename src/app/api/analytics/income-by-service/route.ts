import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      select: {
        date: true,
        servicePrice: true,
        service: {
          select: { name: true },
        },
      },
    });

    const result: Record<string, any> = {};

    appointments.forEach((a) => {
      const d = new Date(a.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!result[key]) result[key] = { month: key };

      const service = a.service?.name ?? "Sin servicio";
      const price = a.servicePrice ?? 0;

      result[key][service] = (result[key][service] ?? 0) + price;
    });

    return NextResponse.json(Object.values(result));
  } catch (error) {
    console.error("❌ ERROR INCOME BY SERVICE:", error);
    return NextResponse.json(
      { error: "No se pudo calcular ingresos." },
      { status: 500 }
    );
  }
}
