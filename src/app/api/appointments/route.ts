import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateAppointment = z.object({
  userId: z.string(),
  serviceId: z.string(),
  date: z.string(),
  notes: z.string().optional(),
});

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: { user: true, service: true },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateAppointment.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { userId, serviceId, date, notes } = parsed.data;

  const appointment = await prisma.appointment.create({
    data: {
      userId,
      serviceId,
      date: new Date(date),
      notes,
    },
    include: { user: true, service: true },
  });

  return NextResponse.json(appointment);
}
