import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  // Cookie de sesión
  response.cookies.set("token", "admin", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  // Cookie con nombre de usuario (solo UI)
  response.cookies.set("username", "Admin", {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
