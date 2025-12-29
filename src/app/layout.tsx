"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // obtiene la ruta actual

  const showNavbar = pathname !== "/login"; // ocultar navbar solo en login

  return (
    <html lang="es">
      <body className="min-h-screen">
        {showNavbar && <Navbar />}
        <div className={showNavbar ? "pt-16" : ""}>{children}</div>
      </body>
    </html>
  );
}
