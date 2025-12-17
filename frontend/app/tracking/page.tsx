'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import ParkingMap from '../components/ParkingMap'
import { RefreshCw } from 'lucide-react'

interface SlotStatus {
  occupied: boolean
  rfid_id: string | null
  license_plate: string | null
  time_in: string | null
}

// Initialize empty slots structure
const initializeEmptySlots = (): Record<string, SlotStatus> => {
  const rows = ['A', 'B', 'C', 'D', 'E']
  const slotsPerRow = 5
  const emptySlots: Record<string, SlotStatus> = {}
  
  rows.forEach(row => {
    for (let i = 1; i <= slotsPerRow; i++) {
      emptySlots[`${row}${i}`] = {
        occupied: false,
        rfid_id: null,
        license_plate: null,
        time_in: null
      }
    }
  })
  return emptySlots
}

export default function TrackingPage() {
  const [slots, setSlots] = useState<Record<string, SlotStatus>>(initializeEmptySlots())
  const [slotsLoading, setSlotsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<number>(0)
  const [occupiedSlots, setOccupiedSlots] = useState<number>(0)
  const [totalSlots, setTotalSlots] = useState<number>(0)

  const fetchSlotsStatus = async () => {
    try {
      setSlotsLoading(true)
      setError(null)
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/parking-slots/status`
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch parking slots status: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Update slot counts
      setAvailableSlots(data.available_slots || 0)
      setOccupiedSlots(data.occupied_slots || 0)
      setTotalSlots(data.total_slots || 0)
      
      // Ensure we have slots data
      if (data.slots) {
        setSlots(data.slots)
      } else {
        // If no slots in response, create empty slots structure
        const rows = ['A', 'B', 'C', 'D', 'E']
        const slotsPerRow = 5
        const emptySlots: Record<string, SlotStatus> = {}
        
        rows.forEach(row => {
          for (let i = 1; i <= slotsPerRow; i++) {
            emptySlots[`${row}${i}`] = {
              occupied: false,
              rfid_id: null,
              license_plate: null,
              time_in: null
            }
          }
        })
        setSlots(emptySlots)
      }
      
      setError(null)
    } catch (err) {
      console.error('Failed to fetch slots:', err)
      
      if (err instanceof Error) {
        setError(`Error: ${err.message}`)
      } else {
        setError('Failed to fetch parking slots status. Please check if the backend server is running.')
      }
      
      // Set empty slots on error so the map still renders
      const rows = ['A', 'B', 'C', 'D', 'E']
      const slotsPerRow = 5
      const emptySlots: Record<string, SlotStatus> = {}
      
      rows.forEach(row => {
        for (let i = 1; i <= slotsPerRow; i++) {
          emptySlots[`${row}${i}`] = {
            occupied: false,
            rfid_id: null,
            license_plate: null,
            time_in: null
          }
        }
      })
      setSlots(emptySlots)
    } finally {
      setSlotsLoading(false)
    }
  }

  useEffect(() => {
    fetchSlotsStatus()
  }, [])

  const handleRefresh = () => {
    fetchSlotsStatus()
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Real-time Tracking</h1>
          <button
            onClick={handleRefresh}
            disabled={slotsLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={20} className={slotsLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Slot Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Slots</p>
                <p className="text-3xl font-bold mt-2">{totalSlots}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl font-bold">{totalSlots}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available</p>
                <p className="text-3xl font-bold mt-2 text-green-600">{availableSlots}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl font-bold">{availableSlots}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Occupied</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{occupiedSlots}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl font-bold">{occupiedSlots}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parking Slot Map */}
        <ParkingMap slots={slots} loading={slotsLoading} />
      </div>
    </DashboardLayout>
  )
}

