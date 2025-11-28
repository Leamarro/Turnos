"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  price: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const load = async () => {
    const res = await fetch("/api/services");
    setServices(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const deleteService = async (id: string) => {
    if (!confirm("¿Eliminar servicio?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Servicios</h1>
        <Link
          href="/services/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          + Nuevo servicio
        </Link>
      </div>

      <div className="bg-white rounded-2xl border shadow p-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="p-4 flex justify-between border-b last:border-none"
          >
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-gray-500">${s.price}</p>
            </div>

            <div className="flex gap-3">
              <Link className="text-blue-600" href={`/services/${s.id}/edit`}>
                Editar
              </Link>

              <button
                className="text-red-600"
                onClick={() => deleteService(s.id)}
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
