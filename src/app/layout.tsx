import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
