import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ==========================
// GET → obtener 1 o todos
// ==========================
export async function GET(req: Request) {
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
    include: { user: true, service: true },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(appointments);
}

// ==========================
// POST → crear turno
// ==========================
export async function POST(req: Request) {
  try {
    const { name, telefono, serviceId, date, time } = await req.json();

    const datetime = new Date(`${date}T${time}:00`);

    // 1️⃣ Buscar usuario por telefono
    let user = await prisma.user.findUnique({
      where: { telefono },
    });

    // 2️⃣ Si no existe → crearlo
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          telefono,
        },
      });
    }

    // 3️⃣ Crear turno conectando user existente o recién creado
    const appointment = await prisma.appointment.create({
      data: {
        date: datetime,
        status: "pendiente",
        service: { connect: { id: serviceId } },
        user: { connect: { id: user.id } },
      },
    });

    return NextResponse.json(appointment);
  } catch (err) {
    console.error("❌ ERROR POST /appointments:", err);
    return NextResponse.json(
      { error: "Error al crear el turno" },
      { status: 500 }
    );
  }
}


// ==========================
// PUT → actualizar turno
// ==========================
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { name, telefono, serviceId, date, time, status } = await req.json();

    const datetime = new Date(`${date}T${time}:00`);

    const ap = await prisma.appointment.update({
      where: { id },
      data: {
        date: datetime,
        status,
        service: {
          connect: { id: serviceId }, // ← STRING ✔
        },
        user: {
          update: {
            data: {
              name,
              telefono,
            },
          },
        },
      },
      include: { user: true, service: true },
    });

    return NextResponse.json(ap);
  } catch (err) {
    console.error("❌ ERROR PUT /appointments:", err);
    return NextResponse.json(
      { error: "Error al actualizar el turno" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE → eliminar turno
// ==========================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ ERROR DELETE /appointments:", err);
    return NextResponse.json(
      { error: "Error al eliminar el turno" },
      { status: 500 }
    );
  }
}
