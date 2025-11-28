import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const { name, price } = await req.json();
  if (!name || !price) {
    return NextResponse.json({ error: "Datos faltantes" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: { name, price: Number(price) },
  });

  return NextResponse.json(service);
}
