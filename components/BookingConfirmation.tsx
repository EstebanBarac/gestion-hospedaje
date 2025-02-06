import { CheckCircle } from 'lucide-react'

interface BookingConfirmationProps {
  guestName: string
}

export default function BookingConfirmation({ guestName }: BookingConfirmationProps) {
  return (
    <div className="text-center p-6 bg-green-50 rounded-lg shadow-lg">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-green-700 mb-2">¡Reserva Enviada!</h2>
      <p className="text-lg text-green-600 mb-4">
        Gracias, {guestName}. Tu solicitud de reserva ha sido recibida.
      </p>
      <p className="text-gray-600">
        Por favor, espera la confirmación y contacto por parte del hospedaje. 
        Te enviaremos un correo electrónico con más detalles pronto.
      </p>
    </div>
  )
}
