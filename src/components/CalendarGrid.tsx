"use client";

import { useState } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

type Appointment = {
  id: string;
  date: string;
  user: { name: string };
  service: { name: string };
};

export default function CalendarGrid({
  appointments,
  view,
}: {
  appointments: Appointment[];
  view: "week" | "month";
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // -----------------------------
  // Helpers
  // -----------------------------

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  // -----------------------------
// DÍAS A MOSTRAR (inicio = HOY)
// -----------------------------
const today = new Date();

let days =
  view === "week"
    ? getWeekDays()
    : getMonthDays().filter((d) => d >= startOfDay(today));



  const getAppointmentsByDay = (day: Date) => {
    return appointments.filter(
      (a) => format(new Date(a.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
  };

  // -----------------------------
  // Navegación
  // -----------------------------

  const next = () => {
    setCurrentDate((prev) =>
      view === "week" ? addDays(prev, 7) : addDays(prev, 30)
    );
  };

  const prev = () => {
    setCurrentDate((prev) =>
      view === "week" ? addDays(prev, -7) : addDays(prev, -30)
    );
  };

  // -----------------------------
  // RENDER MOBILE
  // -----------------------------

  if (typeof window !== "undefined" && window.innerWidth < 640) {
    return (
      <div className="space-y-4">
        {/* Header Mobile */}
        <div className="flex justify-between items-center">
          <button onClick={prev} className="text-xl">◀</button>
          <h2 className="font-semibold text-lg">
            {format(currentDate, view === "week" ? "dd MMM yyyy" : "MMMM yyyy", {
              locale: es,
            })}
          </h2>
          <button onClick={next} className="text-xl">▶</button>
        </div>

        {/* Lista de días */}
        {days.map((day) => {
          const dayAppointments = getAppointmentsByDay(day);
          return (
            <div key={day.toString()} className="border rounded-xl p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-1">
                {format(day, "EEEE dd", { locale: es })}
              </h3>

              {dayAppointments.length === 0 && (
                <p className="text-gray-500 text-sm">Sin turnos</p>
              )}

              {dayAppointments.map((a) => (
                <div
                  key={a.id}
                  className="bg-gray-100 p-2 rounded-lg mt-2 border"
                >
                  <p className="font-medium">{a.user.name}</p>
                  <p className="text-sm text-gray-600">{a.service.name}</p>
                  <p className="text-xs text-gray-700">
                    {format(new Date(a.date), "HH:mm")} hs
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // -----------------------------
  // RENDER DESKTOP – Calendario Grid
  // -----------------------------

  return (
    <div>
      {/* Header Desktop */}
      <div className="flex justify-between mb-4">
        <button onClick={prev} className="text-xl">◀</button>

        <h2 className="text-xl font-semibold">
          {format(currentDate, view === "week" ? "dd MMM yyyy" : "MMMM yyyy", {
            locale: es,
          })}
        </h2>

        <button onClick={next} className="text-xl">▶</button>
      </div>

      {/* Grid */}
      <div
        className={`grid ${
          view === "week" ? "grid-cols-7" : "grid-cols-7"
        } gap-2`}
      >
        {days.map((day) => {
          const dayAppointments = getAppointmentsByDay(day);
          return (
            <div
              key={day.toString()}
              className="border rounded-lg p-2 bg-white min-h-[110px]"
            >
              <p className="text-sm font-semibold mb-1">
                {format(day, "dd", { locale: es })}
              </p>

              {dayAppointments.map((a) => (
                <div
                  key={a.id}
                  className="bg-gray-100 p-1 rounded mb-1 text-xs border"
                >
                  <p className="font-medium">{a.user.name}</p>
                  <p>{a.service.name}</p>
                  <p>{format(new Date(a.date), "HH:mm")} hs</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
