"use client"

import { useEffect, useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import axios from "axios"

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>()
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    async function fetchAppointments() {
      const res = await axios.get("/api/appointments")
      setAppointments(res.data)
    }
    fetchAppointments()
  }, [])

  // Obtener las fechas de los turnos ocupados
  const occupiedDates = appointments.map(a => new Date(a.date))

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Calendario de Turnos</h2>
      
      <DayPicker
        mode="single"
        locale={es}
        selected={selectedDay}
        onSelect={setSelectedDay}
        modifiers={{
          ocupado: (day) => occupiedDates.some(d => isSameDay(d, day)),
        }}
        modifiersStyles={{
          ocupado: { backgroundColor: "#f87171", color: "white" },
        }}
      />

      {selectedDay && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">
            Turnos del {format(selectedDay, "dd/MM/yyyy")}
          </h3>
          <ul className="space-y-2">
            {appointments
              .filter(a => isSameDay(new Date(a.date), selectedDay))
              .map(a => (
                <li
                  key={a.id}
                  className="p-2 bg-gray-100 rounded-md text-sm flex justify-between"
                >
                  <span>Servicio: {a.service?.name ?? a.serviceId}</span>
                  <span>{format(new Date(a.date), "HH:mm")}</span>
                </li>
              ))}
            {appointments.filter(a => isSameDay(new Date(a.date), selectedDay)).length === 0 && (
              <p className="text-gray-500 text-sm">No hay turnos para este día.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
