'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, apartments(name)')
        .order('created_at', { ascending: false })
      
      setBookings(data || [])
    }

    fetchBookings()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Reservas</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Departamento</th>
              <th className="p-3 text-left">Huésped</th>
              <th className="p-3 text-left">Fechas</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="p-3">{booking.apartments?.name}</td>
                <td className="p-3">
                  <div>{booking.guest_name}</div>
                  <div className="text-sm text-gray-600">{booking.guest_email}</div>
                </td>
                <td className="p-3">
                  {new Date(booking.start_date).toLocaleDateString()} - 
                  {new Date(booking.end_date).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {booking.status !== 'confirmed' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Confirmar
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}