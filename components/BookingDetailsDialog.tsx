"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, User, Mail, Phone, Users, House } from "lucide-react"

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

interface BookingDetailsDialogProps {
  booking: Booking | null
  onClose: () => void
  onBookingUpdated: () => void
}

export default function BookingDetailsDialog({ booking, onClose, onBookingUpdated }: BookingDetailsDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancelBooking = async () => {
    if (!booking) return

    setIsProcessing(true)
    setError(null)

    try {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", booking.id)

      if (error) throw error

      onBookingUpdated()
      onClose()
    } catch (err) {
      console.error("Error canceling booking:", err)
      setError("Error al cancelar la reserva. Por favor, inténtalo de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={!!booking} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalles de la Reserva</DialogTitle>
        </DialogHeader>

        {booking && (
          <div className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-lg space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fechas</p>
                  <p className="text-sm">Desde: {format(new Date(booking.start_date), "PPP", { locale: es })}</p>
                  <p className="text-sm">Hasta: {format(new Date(booking.end_date), "PPP", { locale: es })}</p>
                </div>
              </div>


                <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <House className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Departamento</p>
                  <p className="text-sm">{booking.apartment.name}</p>
                </div>
              </div>



              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Huésped</p>
                  <p className="text-sm">{booking.guest_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{booking.guest_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p className="text-sm">{booking.guest_phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Huéspedes</p>
                  <p className="text-sm">{booking.num_guests} personas</p>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="destructive"
            onClick={handleCancelBooking}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? "Procesando..." : "Cancelar Reserva"}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

