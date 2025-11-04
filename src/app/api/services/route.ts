import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, duration, price } = body;

  if (!name || !duration || !price) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: { name, duration: Number(duration), price: Number(price) },
  });

  return NextResponse.json(service);
}
