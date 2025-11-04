"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Appointment = {
  id: string;
  date: string;
  user: { name: string; email: string };
  service: { name: string; duration: number; price: number };
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    axios.get("/api/appointments").then(res => setAppointments(res.data));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-4">Próximos turnos</h2>
      <ul>
        {appointments.map(a => (
          <li key={a.id} className="py-2 border-b flex justify-between">
            <div>
              <div className="font-medium">{a.service.name} - {new Date(a.date).toLocaleString()}</div>
              <div className="text-sm text-gray-500">{a.user.name} - {a.user.email}</div>
            </div>
            <div className="text-sm">Duración: {a.service.duration} min</div>
          </li>
        ))}
        {appointments.length === 0 && <li className="text-sm text-gray-500">No hay turnos</li>}
      </ul>
    </div>
  );
}
