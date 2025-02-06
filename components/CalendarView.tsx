'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function CalendarView() {
  const [bookings, setBookings] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, start_date, end_date, apartments(name), status')

      if (error) {
        console.error('Error fetching bookings:', error)
      } else {
        setBookings(data || [])
      }
    }

    fetchBookings()
  }, [])

  // Determina si una fecha está reservada
  const isBooked = (date: Date) => {
    return bookings.some(booking => {
      const start = new Date(booking.start_date)
      const end = new Date(booking.end_date)
      return date >= start && date <= end
    })
  }

  // Aplica clases según el estado de la reserva
  const dayClassName = (date: Date) => {
    return isBooked(date) 
      ? 'bg-red-500 text-white font-bold rounded-lg'  // Días reservados en rojo
      : 'hover:bg-gray-200 rounded-lg'
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 text-center">
            📅 Calendario de Reservas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 📌 DatePicker con estilos mejorados */}
            <div className="border p-4 rounded-lg shadow-md bg-white flex-1">
              <DatePicker
                selected={selectedDate}
                //@ts-ignore
                onChange={(date: Date) => setSelectedDate(date)}
                inline
                calendarClassName="w-full"
                dayClassName={dayClassName}
                //@ts-ignore
                highlightDates={bookings.map(b => ({
                  "start": new Date(b.start_date),
                  "end": new Date(b.end_date)
                }))}
              />
            </div>

            {/* 📌 Lista de reservas con diseño moderno */}
            <div className="w-full lg:w-1/2">
              <h3 className="text-lg font-bold text-gray-700 mb-2">📌 Reservas Confirmadas</h3>
              <ScrollArea className="h-60 overflow-y-auto border rounded-lg shadow-sm p-3 bg-gray-50">
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay reservas registradas.</p>
                ) : (
                  bookings.map(booking => (
                    <Popover key={booking.id}>
                      <PopoverTrigger asChild>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white shadow hover:bg-gray-100 transition cursor-pointer">
                          <span className="font-semibold text-gray-800">{booking.apartments?.name}</span>
                          <Badge variant="outline" className="text-sm">
                            {new Date(booking.start_date).toLocaleDateString()} - 
                            {new Date(booking.end_date).toLocaleDateString()}
                          </Badge>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-4 shadow-lg">
                        <h4 className="text-md font-bold text-gray-700">Detalles de la reserva</h4>
                        <p className="text-gray-600">
                          <strong>Apartamento:</strong> {booking.apartments?.name}
                        </p>
                        <p className="text-gray-600">
                          <strong>Fechas:</strong> {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </p>
                      </PopoverContent>
                    </Popover>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
