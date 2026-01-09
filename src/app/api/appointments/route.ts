//forzar re deploy
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// =========================
// GET — obtener turno(s)
// =========================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const date = searchParams.get("date");

    const isValidId = id && id !== "undefined" && id.trim() !== "";

    // ✅ Obtener turno por ID
    if (isValidId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: { user: true, service: true },
      });

      if (!appointment) {
        return NextResponse.json(
          { error: "Turno no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(appointment);
    }

    // ✅ Obtener todos los turnos o por fecha
    const appointments = await prisma.appointment.findMany({
      where: date
        ? {
            date: {
              gte: new Date(`${date}T00:00:00`),
              lte: new Date(`${date}T23:59:59`),
            },
          }
        : {},
      include: { user: true, service: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("❌ ERROR GET APPOINTMENTS:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los turnos" },
      { status: 500 }
    );
  }
}

// =========================
// POST — crear turno ✅ (ESTO FALTABA)
// =========================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      date,
      user: { name, lastName, phone },
      service: { id: serviceId },
    } = body;

    if (!date || !serviceId || !name || !lastName || !phone) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "El servicio no existe" },
        { status: 404 }
      );
    }

    // ✅ Crear o actualizar usuario (por teléfono)
    const user = await prisma.user.upsert({
      where: { telefono: phone },
      update: {
        name,
        lastName,
      },
      create: {
        name,
        lastName,
        telefono: phone,
      },
    });

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        serviceId,
        userId: user.id,
        status: "pendiente",
      },
      include: {
        user: true,
        service: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("❌ ERROR CREATE APPOINTMENT:", error);
    return NextResponse.json(
      { error: "No se pudo crear el turno" },
      { status: 500 }
    );
  }
}


// =========================
// PUT — actualizar turno
// =========================
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const isValidId = id && id !== "undefined" && id.trim() !== "";

    if (!isValidId) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, lastName, telefono, serviceId, date, time, status } = body;


    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 }
      );
    }

    if (!existingAppointment.userId) {
  return NextResponse.json(
    { error: "El turno no tiene usuario asociado" },
    { status: 400 }
  );
}


    //  Actualizar usuario
await prisma.user.update({
  where: { id: existingAppointment.userId },
  data: {
    name,
    lastName,
    telefono,
  },
});



    // ✅ Combinar fecha y hora
    const dateTime = new Date(`${date}T${time}`);

    // ✅ Actualizar turno
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: dateTime,
        serviceId,
        status,
      },
      include: { user: true, service: true },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("❌ ERROR UPDATE APPOINTMENT:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el turno" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE — eliminar turno
// =========================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const isValidId = id && id !== "undefined" && id.trim() !== "";

    if (!isValidId) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Turno eliminado correctamente",
    });
  } catch (error) {
    console.error("❌ ERROR DELETE APPOINTMENT:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el turno" },
      { status: 500 }
    );
  }
}
