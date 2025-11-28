"use client";
import Link from "next/link";
import { Home, Calendar, Layers, DollarSign } from "lucide-react";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Beat Makeup</h2>
        <p className="text-sm text-gray-500">Panel</p>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
          <Home size={18} /> Dashboard
        </Link>
        <Link href="/admin" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
          <Calendar size={18} /> Turnos
        </Link>
        <Link href="/precios" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
          <DollarSign size={18} /> Servicios / Precios
        </Link>
        <Link href="/" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
          <Layers size={18} /> Volver al sitio
        </Link>
      </nav>
    </aside>
  );
}
