'use client'

import { Car, MapPin } from 'lucide-react'

interface SlotStatus {
  occupied: boolean
  rfid_id: string | null
  license_plate: string | null
  time_in: string | null
}

interface ParkingMapProps {
  slots: Record<string, SlotStatus>
  loading?: boolean
}

export default function ParkingMap({ slots, loading }: ParkingMapProps) {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading parking map...</p>
        </div>
      </div>
    )
  }

  // Define standard rows and slots per row
  const rows = ['A', 'B', 'C', 'D', 'E']
  const slotsPerRow = 5

  // Group slots by row and ensure each row has exactly slotsPerRow slots
  const groupedSlots: Record<string, Array<[string, SlotStatus]>> = {}
  
  rows.forEach(row => {
    groupedSlots[row] = []
    for (let i = 1; i <= slotsPerRow; i++) {
      const slotName = `${row}${i}`
      const status = slots[slotName] || {
        occupied: false,
        rfid_id: null,
        license_plate: null,
        time_in: null
      }
      groupedSlots[row].push([slotName, status])
    }
  })


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Parking Slot Map</h2>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600">Occupied</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSlots).map(([row, rowSlots]) => (
          <div key={row}>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Row {row}</h3>
            <div className="grid grid-cols-5 gap-3">
              {rowSlots.map(([slotName, status]) => (
                <div
                  key={slotName}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all
                    ${status.occupied
                      ? 'bg-red-50 border-red-300 hover:border-red-400'
                      : 'bg-green-50 border-green-300 hover:border-green-400'
                    }
                  `}
                >
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center mb-2
                      ${status.occupied ? 'bg-red-500' : 'bg-green-500'}
                    `}>
                      <Car 
                        size={20} 
                        className={status.occupied ? 'text-white' : 'text-white'}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">{slotName}</p>
                      {status.occupied ? (
                        <div className="mt-1 text-xs">
                          <p className="text-red-700 font-medium">Occupied</p>
                          {status.license_plate && status.license_plate !== 'N/A' && (
                            <p className="text-gray-600 mt-1">{status.license_plate}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-green-700 font-medium text-xs mt-1">Available</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

