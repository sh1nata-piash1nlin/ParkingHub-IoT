import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IoT Smart Parking - Admin Dashboard',
  description: 'Admin dashboard for IoT Smart Parking system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

