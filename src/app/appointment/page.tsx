"use client"

import { useState } from "react"

export default function AppointmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🔗 Combinar fecha + hora
    const fullDate = new Date(`${formData.date}T${formData.time}:00`)

    const newAppointment = {
      user: { name: formData.name, phone: formData.phone },
      service: { name: formData.service },
      date: fullDate.toISOString(),
    }

    console.log("Nuevo turno:", newAppointment)

    // Aquí harías la llamada al backend o Firebase
    // await fetch("/api/appointments", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(newAppointment),
    // })

    alert("Turno reservado con éxito 🎉")
    setFormData({ name: "", phone: "", service: "", date: "", time: "" })
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 mt-6 sm:mt-10">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        Reservar Turno
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="Ej: 11 5555-5555"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9+\s-]{8,15}"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Servicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servicio
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Seleccioná un servicio</option>
            <option value="Maquillaje">Maquillaje</option>
            <option value="Perfilado de cejas">Perfilado de cejas</option>
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Confirmar Turno
        </button>
      </form>
    </div>
  )
}
