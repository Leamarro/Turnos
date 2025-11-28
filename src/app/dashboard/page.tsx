"use client";

import { useEffect, useMemo, useState } from "react";
import { exportToCsv } from "@/lib/exportCsv";
import StatCard from "@/components/StatCard";
import TurnsTable from "@/components/TurnsTable";
import MonthlyIncomeByServiceChart from "@/components/MonthlyIncomeByServiceChart";

type Appointment = {
  id: string;
  date: string;
  status: string;
  service: { id: string; name: string; price?: number } | null;
  user: { id: string; name?: string | null; telefono?: string | null } | null;
  servicePrice?: number | null;
};

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/appointments", { cache: "no-store" });
        if (!res.ok) throw new Error("Error cargando turnos");
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("ERROR FETCH APPOINTMENTS:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filters
  const filtered = useMemo(() => {
    return appointments
      .filter((a) => {
        const qq = q.toLowerCase();

        if (q) {
          const name = a.user?.name?.toLowerCase() ?? "";
          const phone = a.user?.telefono ?? "";
          const service = a.service?.name?.toLowerCase() ?? "";
          if (!name.includes(qq) && !phone.includes(qq) && !service.includes(qq)) return false;
        }

        if (from && new Date(a.date) < new Date(`${from}T00:00:00`)) return false;
        if (to && new Date(a.date) > new Date(`${to}T23:59:59`)) return false;

        return true;
      })
      .sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());
  }, [appointments, q, from, to]);

  // Metrics
  const totalTurns = filtered.length;

  const turnsToday = filtered.filter((a) => {
    const d = new Date(a.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const incomeMonth = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return filtered.reduce((sum, a) => {
      const d = new Date(a.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        return sum + (a.servicePrice ?? a.service?.price ?? 0);
      }
      return sum;
    }, 0);
  }, [filtered]);

  const topService = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((a) => {
      const name = a.service?.name ?? "Sin servicio";
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "—";
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* MAIN CONTENT */}
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        {/* CHART - Ingresos por mes */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Ingresos por mes</h2>
          <MonthlyIncomeByServiceChart />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Turnos totales" value={totalTurns.toString()} />
          <StatCard title="Ingresos (mes)" value={`$ ${incomeMonth}`} />
          <StatCard title="Turnos hoy" value={turnsToday.toString()} />
          <StatCard title="Servicio top" value={topService} />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          <input
            type="date"
            value={from ?? ""}
            onChange={(e) => setFrom(e.target.value || null)}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="date"
            value={to ?? ""}
            onChange={(e) => setTo(e.target.value || null)}
            className="border rounded-md p-2 w-full"
          />

          <input
            placeholder="Buscar cliente / servicio / teléfono"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border rounded-md p-2 w-full sm:col-span-2 lg:col-span-1"
          />

          <button
            onClick={() =>
              exportToCsv(
                "turnos.csv",
                filtered.map((a) => ({
                  id: a.id,
                  date: new Date(a.date).toLocaleString(),
                  client: a.user?.name ?? "",
                  telefono: a.user?.telefono ?? "",
                  service: a.service?.name ?? "",
                  price: a.servicePrice ?? a.service?.price ?? 0,
                  status: a.status,
                }))
              )
            }
            className="bg-black text-white px-4 py-2 rounded-md w-full"
          >
            Exportar CSV
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <TurnsTable data={filtered} loading={loading} />
        </div>
      </main>
    </div>
  );
}
