export interface Apartment {
    id: string
    name: string
    description: string
    price_per_night: number
    max_guests: number
    images: string[]
    amenities: string[]
    location: string
  }
  
  export interface Booking {
    id: string
    apartment_id: string
    guest_name: string
    guest_email: string
    guest_phone: string
    start_date: string
    end_date: string
    num_guests: number
    status: 'pending' | 'confirmed' | 'cancelled'
  }
  
  export interface Task {
    id: string
    title: string
    description?: string
    due_date?: string
    completed: boolean
    priority?: 'low' | 'medium' | 'high'
  }