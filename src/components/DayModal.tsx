"use client"

import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import axios from "axios"

interface Appointment {
  id: string
  date: string
  service?: { name: string }
  clientName?: string
  notes?: string
}

interface Service {
  id: string
  name: string
}

interface DayModalProps {
  open: boolean
  onClose: () => void
  date: Date | null
  appointments: Appointment[]
  onAppointmentAdded: () => void
}

export default function DayModal({ open, onClose, date, appointments, onAppointmentAdded }: DayModalProps) {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState({ serviceId: "", clientName: "", time: "", notes: "" })
  const [loading, setLoading] = useState(false)

  if (!date) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post("/api/appointments", {
        date: new Date(`${date.toISOString().split("T")[0]}T${form.time}:00`),
        serviceId: form.serviceId,
        clientName: form.clientName,
        notes: form.notes,
      })
      onAppointmentAdded()
      setForm({ serviceId: "", clientName: "", time: "", notes: "" })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadServices = async () => {
    if (services.length === 0) {
      const res = await axios.get("/api/services")
      setServices(res.data)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-[90%] max-w-md mx-auto relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
              {format(date, "EEEE d 'de' MMMM", { locale: es })}
            </h3>

            {appointments.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {appointments.map((a) => (
                  <li
                    key={a.id}
                    className="border rounded-xl p-3 sm:p-4 bg-indigo-50 hover:bg-indigo-100 transition"
                  >
                    <p className="font-medium text-indigo-700">{a.service?.name || "Servicio"}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      🕒 {format(new Date(a.date), "HH:mm")} hs
                    </p>
                    {a.clientName && (
                      <p className="text-xs sm:text-sm text-gray-600">👤 {a.clientName}</p>
                    )}
                    {a.notes && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 italic">{a.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center text-sm mb-4">No hay turnos para este día.</p>
            )}

            {/* Formulario de nuevo turno */}
            <form onSubmit={handleSubmit} className="space-y-3" onFocus={loadServices}>
              <h4 className="text-sm font-semibold text-gray-700 text-center">Agregar turno</h4>

              <select
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
                required
              >
                <option value="">Seleccionar servicio</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Nombre del cliente"
                className="w-full border rounded-lg p-2 text-sm"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                required
              />

              <input
                type="time"
                className="w-full border rounded-lg p-2 text-sm"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />

              <textarea
                placeholder="Notas (opcional)"
                className="w-full border rounded-lg p-2 text-sm"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar turno"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
