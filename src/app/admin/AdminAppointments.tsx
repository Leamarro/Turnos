"use client";

import { useState, useMemo } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

type Appointment = {
  id: string;
  date: string;
  service: { name: string };
  user: { name: string };
};

export default function CalendarGrid({
  appointments,
  view,
}: {
  appointments: Appointment[];
  view: "week" | "month";
}) {
  const DAYS = view === "week" ? 7 : 30;

  const [offset, setOffset] = useState(0); // mover días hacia adelante/atrás

  const today = new Date();

  // rango visible según offset
  const visibleStart = addDays(today, offset);
  const visibleEnd = addDays(visibleStart, DAYS);

  // generar array de días
  const daysArray = useMemo(() => {
    const arr = [];
    for (let i = 0; i < DAYS; i++) {
      arr.push(addDays(visibleStart, i));
    }
    return arr;
  }, [visibleStart, DAYS]);

  // agrupar turnos por día
  const grouped = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((a) => {
      const d = format(new Date(a.date), "yyyy-MM-dd");
      if (!map[d]) map[d] = [];
      map[d].push(a);
    });
    return map;
  }, [appointments]);

  return (
    <div className="w-full">
      {/* Filtros y navegación */}
      <div className="flex items-center justify-between mb-4 px-2">
        {/* Flecha atrás */}
        <button
          onClick={() => setOffset((prev) => prev - DAYS)}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          ◀
        </button>

        <div className="text-sm text-gray-600 font-medium">
          {format(visibleStart, "dd MMM", { locale: es })} —{" "}
          {format(visibleEnd, "dd MMM", { locale: es })}
        </div>

        {/* Flecha adelante */}
        <button
          onClick={() => setOffset((prev) => prev + DAYS)}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          ▶
        </button>
      </div>

      {/* GRID DE DÍAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {daysArray.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const isToday = isSameDay(day, today);

          return (
            <div
              key={key}
              className={`rounded-2xl shadow-md p-4 border bg-white transition ${
                isToday ? "border-black" : "border-gray-200"
              }`}
            >
              {/* Encabezado del día */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">
                  {isToday ? "Hoy" : format(day, "EEEE", { locale: es })}
                </h2>

                <span className="text-sm text-gray-600">
                  {format(day, "dd/MM")}
                </span>
              </div>

              {/* Turnos */}
              {grouped[key]?.length ? (
                <div className="space-y-2">
                  {grouped[key].map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 rounded-xl border bg-[#faf9f7]"
                    >
                      <p className="font-semibold">
                        {format(new Date(appointment.date), "HH:mm")} —{" "}
                        {appointment.user?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.service?.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Sin turnos</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
