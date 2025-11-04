import AdminAppointments from "@/app/admin/AdminAppointments"

export default function AdminPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Panel de Turnos</h2>
      <AdminAppointments />
    </div>
  )
}
