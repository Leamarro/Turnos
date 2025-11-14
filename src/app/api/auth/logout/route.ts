import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: "admin-token",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  return res;
}
