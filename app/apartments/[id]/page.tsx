import { supabase } from "@/lib/supabase"
import BookingForm from "@/components/BookingForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ApartmentPage({ params }: PageProps) {
  // Await the params to access the id
  const { id } = await params

  const { data: apartment } = await supabase.from("apartments").select("*").eq("id", id).single()

  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("start_date, end_date")
    .eq("apartment_id", id)
    .eq("status", "confirmed")

  if (!apartment) {
    return <div>Apartment not found</div>
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
          <BookingForm
            apartmentId={id}
            price={apartment.price_per_night}
            maxGuests={apartment.max_guests}
            existingBookings={existingBookings || []}
          />
        </div>
      </div>
    </div>
  )
}

