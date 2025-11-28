"use client";
import React from "react";

type AppointmentRow = {
  id: string;
  date: string;
  status: string;
  service?: { id: string; name?: string; price?: number } | null;
  user?: { id: string; name?: string | null; telefono?: string | null } | null;
  servicePrice?: number | null;
};

export default function TurnsTable({ data, loading }: { data: AppointmentRow[]; loading: boolean }) {
  if (loading) {
    return <p className="p-4 text-gray-500">Cargando turnos...</p>;
  }

  if (!data || data.length === 0) {
    return <p className="p-4 text-gray-500">No hay turnos para el rango seleccionado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="text-left text-gray-600 border-b">
          <tr>
            <th className="p-2">Cliente</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Servicio</th>
            <th className="p-2">Fecha / Hora</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Estado</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{row.user?.name ?? "Sin nombre"}</td>
              <td className="p-2">{row.user?.telefono ?? "-"}</td>
              <td className="p-2">{row.service?.name ?? "-"}</td>
              <td className="p-2">
                {new Date(row.date).toLocaleString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="p-2">${row.servicePrice ?? row.service?.price ?? 0}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    row.status === "confirmado"
                      ? "bg-green-100 text-green-700"
                      : row.status === "cancelado"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
