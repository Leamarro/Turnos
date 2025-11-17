import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// =========================
// GET
// =========================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: { user: true, service: true },
      });
      return NextResponse.json(appointment);
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: { date: "asc" },
      include: { user: true, service: true },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error GET /appointments:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// =========================
// POST
// =========================
export async function POST(req: Request) {
  try {
    const { name, telefono, date, time, serviceId, status } = await req.json();

    if (!name || !telefono || !date || !time || !serviceId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // PARCHE: buscar por teléfono sin tipo estricto
    let user = await prisma.user.findFirst({
      where: { telefono } as any,
    });

    // Si no existe → crearlo
    if (!user) {
      user = await prisma.user.create({
        data: { name, telefono } as any,
      });
    }

    const fullDate = new Date(`${date}T${time}:00`);

    const appointment = await prisma.appointment.create({
      data: {
        date: fullDate,
        serviceId,
        userId: user.id,
        status: status || "pendiente",
      } as any, // parche
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error POST /appointments:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// =========================
// DELETE
// =========================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta ID" }, { status: 400 });
    }

    await prisma.appointment.delete({ where: { id } });

    return NextResponse.json({ message: "Turno eliminado" });
  } catch (error) {
    console.error("Error DELETE /appointments:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// =========================
// PUT
// =========================
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta ID" }, { status: 400 });
    }

    const { name, telefono, date, time, serviceId, status } = await req.json();

    const fullDate = new Date(`${date}T${time}:00`);

    // PARCHE TOTAL: desactivar validación de tipos en update
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date: fullDate,
        serviceId,
        status,
        user: {
          update: {
            name,
            telefono,
          },
        },
