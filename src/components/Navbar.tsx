"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white text-[#111] border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Beat<span className="font-light">Makeup</span>
        </h1>

        {/* Botón móvil */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Navegación escritorio */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Inicio
          </Link>
          <Link href="/appointment" className="hover:opacity-70 transition-opacity">
            Reservar Turno
          </Link>
          <Link href="/admin" className="hover:opacity-70 transition-opacity">
            Panel Admin
          </Link>
        </nav>
      </div>

      {/* Navegación móvil */}
      {menuOpen && (
        <nav className="md:hidden bg-white text-[#111] border-t border-gray-200 shadow-md space-y-3 p-4 animate-fade-in">
          <Link
            href="/"
            className="block hover:opacity-70"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/appointment"
            className="block hover:opacity-70"
            onClick={() => setMenuOpen(false)}
          >
            Reservar Turno
          </Link>
          <Link
            href="/admin"
            className="block hover:opacity-70"
            onClick={() => setMenuOpen(false)}
          >
            Panel Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
