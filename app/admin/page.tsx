"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import BookingDetailsDialog from "@/components/BookingDetailsDialog"
import TaskManager from "@/components/TaskManager"
import { House, LogOut } from "lucide-react"

interface Booking {
  id: string
  apartment_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  start_date: string
  end_date: string
  num_guests: number
  status: string
  apartment: {
    name: string
  }
}

export default function AdminDashboard() {
  const [date, setDate] = useState<Date>(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkSession()
    fetchBookings()
  }, [])

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/login")
    }
  }

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        apartment:apartments (
          name
        )
      `)
      .eq("status", "confirmed")

    if (error) {
      console.error("Error fetching bookings:", error)
    } else {
      setBookings(data)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date)
    }
  }

  const getDayBookings = (day: Date) => {
    return bookings.filter((booking) => {
      const startDate = new Date(booking.start_date)
      const endDate = new Date(booking.end_date)
      return day >= startDate && day <= endDate
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Gestiona las reservas y tareas de tus apartamentos</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        {/* Calendar Card */}
        <Card className="shadow-lg mb-8 flex justify-center">
          <CardContent className="flex justify-center p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={es}
              modifiers={{
                booked: (date) => getDayBookings(date).length > 0,
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "rgb(239 246 255)",
                  borderRadius: "0",
                },
              }}
              className="border rounded-md p-4 w-full max-w-4xl"
              components={{
                DayContent: ({ date }) => {
                  const dayBookings = getDayBookings(date)
                  return (
                    <div className="w-full h-full min-h-[120px] p-2">
                      <span className="text-sm font-medium">{format(date, "d")}</span>
                      <div className="mt-1 space-y-2">
                        {dayBookings.map((booking) => (
                          <div
                            key={booking.id}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSelectedBooking(booking)
                            }}
                            className="w-6 text-start text-xs p-1 bg-green-500 rounded-md text-white truncate hover:bg-green-700/90 transition-colors cursor-pointer"
                          >
                            <House />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Task Manager */}
        <TaskManager />
      </div>

      <BookingDetailsDialog
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onBookingUpdated={fetchBookings}
      />
    </div>
  )
}

