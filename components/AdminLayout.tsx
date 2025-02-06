'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <a href="/admin/bookings" className="px-4 py-2 bg-blue-500 text-white rounded">Reservas</a>
          <a href="/admin/calendar" className="px-4 py-2 bg-blue-500 text-white rounded">Calendario</a>
          <a href="/admin/tasks" className="px-4 py-2 bg-blue-500 text-white rounded">Tareas</a>
        </div>
        {children}
      </div>
    </div>
  )
}