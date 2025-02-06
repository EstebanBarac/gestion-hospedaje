"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import BookingForm from "@/components/BookingForm"
import BookingSuccessMessage from "@/components/BookingSuccessMessage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ApartmentPage({ params }: PageProps) {
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [apartment, setApartment] = useState<any>(null)
  const [existingBookings, setExistingBookings] = useState<any[]>([])

  useState(() => {
    const fetchData = async () => {
      const { id } = await params
      const { data: apartmentData } = await supabase.from("apartments").select("*").eq("id", id).single()
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("apartment_id", id)
        .eq("status", "confirmed")

      setApartment(apartmentData)
      setExistingBookings(bookingsData || [])
    }

    fetchData()
    //@ts-ignore
  }, [params])

  if (!apartment) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{apartment.name}</h1>
          <p className="text-gray-600 text-lg">{apartment.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Comodidades</h3>
              <ul className="list-disc pl-4">
                {apartment.amenities.map((amenity: string) => (
                  <li key={amenity}>{amenity}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Detalles</h3>
              <p>Precio por noche: ${apartment.price_per_night}</p>
              <p>Máximo huéspedes: {apartment.max_guests}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {bookingSuccess ? (
            <BookingSuccessMessage />
          ) : (
            <BookingForm
              apartmentId={apartment.id}
              price={apartment.price_per_night}
              maxGuests={apartment.max_guests}
              existingBookings={existingBookings}
              onBookingSuccess={() => setBookingSuccess(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

