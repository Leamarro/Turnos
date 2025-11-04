"use client"

import { useState } from "react"
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns"
import { es } from "date-fns/locale"
import { CalendarModal } from "./CalendarModal"


type Appointment = {
  id: string
  date: string
  service: { name: string }
  user: { name: string }
}

type Props = {
  appointments: Appointment[]
}

// ✅ Helper para normalizar fechas y evitar errores de zona horaria
const normalizeDate = (date: Date) => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

export function CalendarGrid({ appointments }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [open, setOpen] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { locale: es })
  const endDate = endOfWeek(monthEnd, { locale: es })

  const days = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const nextMonth = () => setCurrentMonth(addDays(monthEnd, 1))
  const prevMonth = () => setCurrentMonth(addDays(startDate, -1))

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="text-indigo-600 font-bold hover:text-indigo-800"
        >
          ←
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h2>
        <button
          onClick={nextMonth}
          className="text-indigo-600 font-bold hover:text-indigo-800"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center text-gray-700 font-medium mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-sm sm:text-base font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((day, idx) => {
          const dayAppointments = appointments.filter((a) =>
            isSameDay(new Date(a.date), normalizeDate(day))
          )
          const isCurrentMonth = isSameMonth(day, monthStart)
          const isSelected =
            selectedDate && isSameDay(normalizeDate(day), selectedDate)

          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedDate(normalizeDate(day))
                setOpen(true)
              }}
              className={`relative cursor-pointer rounded-xl p-2 sm:p-3 flex flex-col items-center justify-between transition-all duration-200 ${
                isCurrentMonth
                  ? "bg-white hover:bg-indigo-50"
                  : "bg-gray-100 text-gray-400"
              } ${isSelected ? "ring-2 ring-indigo-500" : ""}`}
            >
              <span className="text-sm sm:text-base font-semibold">
                {format(day, "d")}
              </span>

              {dayAppointments.length > 0 && (
                <span className="text-xs sm:text-sm text-indigo-600 font-medium">
                  {dayAppointments.length} turno
                  {dayAppointments.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <CalendarModal
          open={open}
          onClose={() => setOpen(false)}
          date={selectedDate}
          appointments={appointments.filter((a) =>
            isSameDay(new Date(a.date), normalizeDate(selectedDate))
          )}
        />
      )}
    </div>
  )
}
