import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // FACTURACIÓN POR MES
    const revenueByMonth = await prisma.appointment.groupBy({
      by: ["serviceId"],
      _sum: { servicePrice: true },
      _count: true,
    });

    // FACTURACIÓN POR DÍA
    const revenueByDay = await prisma.appointment.groupBy({
      by: ["date"],
      _sum: { servicePrice: true },
      _count: true,
    });

    // FACTURACIÓN POR SERVICIO
    const revenueByService = await prisma.service.findMany({
      include: {
        appointments: true,
      },
    });

    return NextResponse.json({
      revenueByMonth,
      revenueByDay,
      revenueByService,
    });
  } catch (e) {
    console.error("Dashboard error:", e);
    return NextResponse.json(
      { error: "Error al cargar el dashboard" },
      { status: 500 }
    );
  }
}
