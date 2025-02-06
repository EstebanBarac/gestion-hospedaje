import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import React from 'react'; // Added import for React

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Panel de Administración',
  description: 'Panel de administración para gestionar reservas de apartamentos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}