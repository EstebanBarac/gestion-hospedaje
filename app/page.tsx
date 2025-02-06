import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: apartments } = await supabase
    .from('apartments')
    .select('*')

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Nuestros Departamentos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apartments?.map((apartment) => (
          <Link
            key={apartment.id}
            href={`/apartments/${apartment.id}`}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={apartment.images[0]}
              alt={apartment.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{apartment.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{apartment.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${apartment.price_per_night}/noche</span>
                <span className="text-sm">Hasta {apartment.max_guests} personas</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}