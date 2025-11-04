"use client"

import { useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Turnos App</h1>

        {/* Botón móvil */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>

        {/* Navegación escritorio */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <Link href="/appointment" className="hover:underline">
            Reservar Turno
          </Link>
          <Link href="/admin" className="hover:underline">
            Panel Admin
          </Link>
        </nav>
      </div>

      {/* Navegación móvil */}
      {menuOpen && (
        <nav className="md:hidden bg-indigo-700 text-white space-y-3 p-4 animate-fade-in">
          <Link href="/" className="block hover:underline" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>
          <Link href="/appointment" className="block hover:underline" onClick={() => setMenuOpen(false)}>
            Reservar Turno
          </Link>
          <Link href="/admin" className="block hover:underline" onClick={() => setMenuOpen(false)}>
            Panel Admin
          </Link>
        </nav>
      )}
    </header>
  )
}
