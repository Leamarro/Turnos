import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        appointments: {
          include: { service: true },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error cargando cliente" },
      { status: 500 }
    );
  }
}
