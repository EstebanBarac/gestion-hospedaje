"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import DatePicker from "react-datepicker"
import { toast } from "react-hot-toast"
import "react-datepicker/dist/react-datepicker.css"

interface Booking {
  start_date: string
  end_date: string
}

interface BookingFormProps {
  apartmentId: string
  price: number
  maxGuests: number
  existingBookings: Booking[]
  onBookingSuccess: () => void
}

export default function BookingForm({
  apartmentId,
  price,
  maxGuests,
  existingBookings,
  onBookingSuccess,
}: BookingFormProps) {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
  })

  const [disabledDates, setDisabledDates] = useState<Date[]>([])

  useEffect(() => {
    const disabled = existingBookings.flatMap((booking) => {
      const start = new Date(booking.start_date)
      const end = new Date(booking.end_date)
      const dates = []
      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        dates.push(new Date(dt))
      }
      return dates
    })
    setDisabledDates(disabled)
  }, [existingBookings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dates[0] || !dates[1]) {
      toast.error("Selecciona fechas válidas")
      return
    }

    if (formData.guests > maxGuests) {
      toast.error(`El número máximo de huéspedes es ${maxGuests}`)
      return
    }

    // Check for booking conflicts
    const conflictingBookings = existingBookings.filter((booking) => {
      const bookingStart = new Date(booking.start_date)
      const bookingEnd = new Date(booking.end_date)
      return (
        //@ts-ignore
        (dates[0] >= bookingStart && dates[0] <= bookingEnd) ||
        //@ts-ignore
        (dates[1] >= bookingStart && dates[1] <= bookingEnd) ||
        //@ts-ignore
        (dates[0] <= bookingStart && dates[1] >= bookingEnd)
      )
    })

    if (conflictingBookings.length > 0) {
      toast.error("Las fechas seleccionadas no están disponibles")
      return
    }

    const { error } = await supabase.from("bookings").insert([
      {
        apartment_id: apartmentId,
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone,
        start_date: dates[0],
        end_date: dates[1],
        num_guests: formData.guests,
        status: "pending",
      },
    ])

    if (error) {
      toast.error("Error al realizar la reserva")
    } else {
      toast.success("¡Reserva enviada! Te contactaremos pronto")
      setFormData({ name: "", email: "", phone: "", guests: 1 })
      setDates([null, null])
      onBookingSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Fecha de entrada</label>
          <DatePicker
            selected={dates[0]}
            onChange={(date) => setDates([date, dates[1]])}
            selectsStart
            startDate={dates[0]}
            endDate={dates[1]}
            minDate={new Date()}
            excludeDates={disabledDates}
            placeholderText="Selecciona fecha"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Fecha de salida</label>
          <DatePicker
            selected={dates[1]}
            onChange={(date) => setDates([dates[0], date])}
            selectsEnd
            startDate={dates[0]}
            endDate={dates[1]}
            //@ts-ignore
            minDate={dates[0]}
            excludeDates={disabledDates}
            placeholderText="Selecciona fecha"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2">Nombre completo</label>
        <input
          type="text"
          required
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">Teléfono</label>
          <input
            type="tel"
            required
            className="w-full p-2 border rounded"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block mb-2">Número de huéspedes</label>
        <input
          type="number"
          min="1"
          max={maxGuests}
          required
          className="w-full p-2 border rounded"
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: Number.parseInt(e.target.value) })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Reservar ahora (Total: ${(price || 0) * (formData.guests || 1)})
      </button>
    </form>
  )
}

