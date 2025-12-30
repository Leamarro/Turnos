"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AppointmentPage() {
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      const res = await axios.get("/api/services");
      setServices(Array.isArray(res.data) ? res.data : []);
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !lastName || !telefono || !date || !time || !serviceId) {
      setError("Por favor completá todos los campos");
      return;
    }

    const combinedDate = new Date(`${date}T${time}:00`);

    try {
      setLoading(true);

      await axios.post("/api/appointments", {
        name: name.trim(),
        lastName: lastName.trim(),
        telefono: telefono.trim(),
        date: combinedDate.toISOString(),
        serviceId,
      });

      setSuccess(true);
      setName("");
      setLastName("");
      setTelefono("");
      setDate("");
      setTime("");
      setServiceId("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al agendar el turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">Agendar turno</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label>Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label>Apellido</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label>Teléfono</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label>Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label>Hora</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label>Servicio</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Seleccionar servicio</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Turno agendado ✅</p>}

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2"
          >
            {loading ? "Guardando..." : "Agendar turno"}
          </button>
        </form>
      </div>
    </div>
  );
}
