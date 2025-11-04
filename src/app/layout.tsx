import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "Turnos App",
  description: "Gestión de turnos de maquillaje y perfilado",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen font-sans">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
