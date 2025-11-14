"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Service = { id: string; name: string };
type Appointment = {
  id: string;
  date: string;
  status: string;
  user: { id: string; name: string; telefono: string };
  service: { id: string; name: string };
};

export default function EditAppointmentPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  // Campos editables
  const [name, setName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadData() {
      const ap = await axios.get(`/api/appointments?id=${id}`);
      const sv = await axios.get("/api/services");

      const a = ap.data;
      setAppointment(a);

      setName(a.user.name);
      setTelefono(a.user.telefono);
      setServiceId(a.service.id);

      // separar fecha y hora
      const d = new Date(a.date);
      setDate(d.toISOString().slice(0, 10));
      setTime(d.toTimeString().slice(0, 5));

      setStatus(a.status);

      setServices(sv.data);
    }

    loadData();
  }, [id]);

  async function handleSave() {
    try {
      await axios.put(`/api/appointments?id=${id}`, {
        name,
        telefono,
        serviceId,
        date,
        time,
        status,
      });

      alert("Turno actualizado correctamente");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar el turno?")) return;

    await axios.delete(`/api/appointments?id=${id}`);
    router.push("/admin");
  }

  if (!appointment) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Editar turno</h2>

      <label className="block">
        Nombre
        <input
          className="input w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="block">
        Teléfono
        <input
          className="input w-full"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </label>

      <label className="block">
        Servicio
        <select
          className="input w-full"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-4">
        <label className="block flex-1">
          Fecha
          <input
            type="date"
            className="input w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block flex-1">
          Hora
          <input
            type="time"
            className="input w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>

      <label className="block">
        Estado
        <select
          className="input w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </label>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Guardar cambios
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Eliminar turno
        </button>
      </div>
    </div>
  );
}
