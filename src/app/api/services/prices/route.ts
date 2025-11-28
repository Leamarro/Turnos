import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      select: { id: true, name: true, price: true },
    });

    return NextResponse.json(services);
  } catch (err) {
    console.error("❌ ERROR GET PRICES:", err);
    return NextResponse.json({ error: "Error obteniendo precios" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { perfilado, maquillaje, prueba } = body;

    const updates = [
      { name: "Perfilado", price: perfilado },
      { name: "Maquillaje", price: maquillaje },
      { name: "Prueba maquillaje", price: prueba }, // ← CORREGIDO
    ];

    await Promise.all(
      updates.map((u) =>
        prisma.service.updateMany({
          where: { name: u.name },
          data: { price: u.price },
        })
      )
    );

    return NextResponse.json({ message: "Precios actualizados" });
  } catch (err) {
    console.error("❌ ERROR UPDATE PRICES:", err);
    return NextResponse.json({ error: "Error actualizando precios" }, { status: 500 });
  }
}
