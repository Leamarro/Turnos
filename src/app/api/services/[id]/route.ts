import prisma from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = params;
  const { name, price } = await req.json();

  const updated = await prisma.service.update({
    where: { id },
    data: {
      name,
      price: Number(price),
    },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = params;

  await prisma.service.delete({
    where: { id },
  });

  return new Response(null, { status: 204 });
}
