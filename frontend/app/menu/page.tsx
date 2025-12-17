'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import CameraView from '../components/CameraView'
import CarInfo from '../components/CarInfo'
import { Activity, Users, Clock, Camera, RefreshCw } from 'lucide-react'

interface CarEvent {
  id: string
  rfid_id: string
  license_plate: string | null
  event_type: string
  created_at: string
  parking_slot: string | null
}

export default function MenuPage() {
  const [carInEvent, setCarInEvent] = useState<CarEvent | null>(null)
  const [carOutEvent, setCarOutEvent] = useState<CarEvent | null>(null)
  const [loading, setLoading] = useState(true)

  // ESP32-CAM stream URLs - Update these with your actual camera IP addresses
  const carInStreamUrl = process.env.NEXT_PUBLIC_CAR_IN_CAMERA_URL || 'http://192.168.1.100:81/stream'
  const carOutStreamUrl = process.env.NEXT_PUBLIC_CAR_OUT_CAMERA_URL || 'http://192.168.1.101:81/stream'

  const fetchRecentEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/parking-events?limit=10`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const data = await response.json()
      const events = data.events || []
      
      // Find most recent IN event
      const inEvent = events.find((e: CarEvent) => 
        e.event_type === 'IN' || e.event_type === null
      )
      
      // Find most recent OUT event
      const outEvent = events.find((e: CarEvent) => 
        e.event_type === 'OUT'
      )
      
      setCarInEvent(inEvent || null)
      setCarOutEvent(outEvent || null)
    } catch (err) {
      console.error('Failed to fetch events:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentEvents()
  }, [])

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard Menu</h1>
          <button
            onClick={fetchRecentEvents}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Events</p>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <Activity className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active RFID Cards</p>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <Users className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Events</p>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <Clock className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Images Stored</p>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <Camera className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Camera Views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CameraView 
            title="CAR IN" 
            streamUrl={carInStreamUrl}
          />
          <CameraView 
            title="CAR OUT" 
            streamUrl={carOutStreamUrl}
          />
        </div>

        {/* Car Information */}
        <CarInfo 
          carInEvent={carInEvent}
          carOutEvent={carOutEvent}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  )
}

