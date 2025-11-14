"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Service = { id: string; name: string; duration: number; price: number };

export default function AppointmentForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
      if (data.length > 0) setServiceId(data[0].id);
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await axios.post("/api/appointments", {
        name,
        telefono,
        date,
        time,
        serviceId,
      });

      setMessage("Turno reservado correctamente ✅");
    } catch (err) {
      console.error(err);
      setMessage("Error al reservar turno ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
      <input
        required
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input w-full"
      />

      <input
        required
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="input w-full"
      />

      <select
        required
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        className="input w-full"
      >
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} - {s.duration} min
          </option>
        ))}
      </select>

      <input
        required
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="input w-full"
      />

      <input
        required
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="input w-full"
      />

      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
        Reservar turno
      </button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
