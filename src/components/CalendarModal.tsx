"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"

type Appointment = {
  id: string
  date: string
  service: { name: string }
  user: { name: string }
}

type Props = {
  open: boolean
  onClose: () => void
  date: Date
  appointments: Appointment[]
}

export function CalendarModal({ open, onClose, date, appointments }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4 text-center">
          {format(date, "EEEE d 'de' MMMM", { locale: es })}
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center">No hay turnos para este día.</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="p-3 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-gray-800 font-medium">{appt.service.name}</p>
                  <p className="text-sm text-gray-500">{appt.user.name}</p>
                </div>
                <span className="text-sm text-indigo-600 font-semibold mt-2 sm:mt-0">
                  {format(new Date(appt.date), "HH:mm")} hs
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
