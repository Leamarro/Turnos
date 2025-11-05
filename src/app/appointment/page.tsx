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

    <form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-soft space-y-4"
>
  <h2 className="text-xl font-semibold mb-4 text-center">Reservar turno</h2>

  <div>
    <label className="block text-sm mb-1">Nombre</label>
    <input type="text" name="name" className="focus:ring-1 focus:ring-[var(--color-accent)]" />
  </div>

  <div>
    <label className="block text-sm mb-1">Teléfono</label>
    <input type="text" name="phone" className="focus:ring-1 focus:ring-[var(--color-accent)]" />
  </div>

  <div>
    <label className="block text-sm mb-1">Servicio</label>
    <select name="service" className="focus:ring-1 focus:ring-[var(--color-accent)]">
      {/* Opciones */}
    </select>
  </div>

  <div className="flex gap-4">
    <div className="flex-1">
      <label className="block text-sm mb-1">Fecha</label>
      <input type="date" name="date" className="focus:ring-1 focus:ring-[var(--color-accent)]" />
    </div>
    <div className="flex-1">
      <label className="block text-sm mb-1">Hora</label>
      <input type="time" name="time" className="focus:ring-1 focus:ring-[var(--color-accent)]" />
    </div>
  </div>

  <input
    type="submit"
    value="Confirmar turno"
    className="w-full mt-4 bg-[var(--color-accent)] text-black py-2 rounded-lg font-medium hover:opacity-80"
  />
</form>

    </div>
  )
}
