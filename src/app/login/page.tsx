export const dynamic = "force-dynamic";
"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login", { password });
      if (res.status === 200) window.location.href = "/";
    } catch {
      setError("Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/makeup-bg.jpg')" }}
    >
      {/* Card */}
      <div
        className="
        w-full max-w-sm mx-4
        bg-white/95 backdrop-blur-md
        rounded-3xl p-8
        shadow-[0_25px_60px_rgba(0,0,0,0.22)]
        animate-[fadeIn_0.6s_ease-out]
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo opcional */}
          {/* <img src="/logo.svg" alt="Logo" className="mx-auto mb-4 h-10" /> */}

          <h1 className="text-3xl font-bold tracking-tight">
            Acceso Admin
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Panel de gestión
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            placeholder="Contraseña"
            className="
              w-full h-12 px-4
              rounded-xl
              border border-gray-200
              bg-white
              focus:outline-none
              focus:border-black
              transition
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-12 rounded-xl
              bg-black text-white font-medium
              hover:bg-neutral-800
              active:scale-[0.98]
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>

      {/* Animación */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
