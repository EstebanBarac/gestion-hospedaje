import { AlertCircle } from "lucide-react"

export default function BookingSuccessMessage() {
  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p className="font-bold">Reserva realizada con éxito</p>
      </div>
      <p className="mt-2">
        Tu reserva ha sido recibida. Por favor, espera la confirmación y contacto por parte del hospedaje. Te enviaremos
        un correo electrónico con los detalles de tu reserva y los próximos pasos.
      </p>
    </div>
  )
}

