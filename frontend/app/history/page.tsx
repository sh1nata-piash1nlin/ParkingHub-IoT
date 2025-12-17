'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Search, Calendar, Filter } from 'lucide-react'

interface ParkingSession {
  id: string
  card_id: string
  license_plate: string
  time_in: string
  time_out: string | null
  parking_slot: string
  image_path: string
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<ParkingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchRfid, setSearchRfid] = useState('')
  const [filteredSessions, setFilteredSessions] = useState<ParkingSession[]>([])

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/parking-sessions?limit=100`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch parking sessions')
        }
        
        const data = await response.json()
        setSessions(data.sessions || [])
        setFilteredSessions(data.sessions || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  useEffect(() => {
    if (searchRfid.trim() === '') {
      setFilteredSessions(sessions)
    } else {
      setFilteredSessions(
        sessions.filter((session) =>
          session.card_id.toLowerCase().includes(searchRfid.toLowerCase()) ||
          session.license_plate.toLowerCase().includes(searchRfid.toLowerCase())
        )
      )
    }
  }, [searchRfid, sessions])

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Parking History</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by Card ID or License Plate..."
                value={searchRfid}
                onChange={(e) => setSearchRfid(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter size={18} />
              <span>{filteredSessions.length} sessions</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading history...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {searchRfid ? 'No sessions found matching your search' : 'No parking history available'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Card ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Plate License
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time IN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time OUT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parking Slot
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{session.card_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.license_plate !== 'N/A' ? session.license_plate : (
                            <span className="text-gray-400 italic">Not available</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(session.time_in).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.time_out ? (
                            new Date(session.time_out).toLocaleString()
                          ) : (
                            <span className="text-green-600 font-medium">Still Parked</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.parking_slot !== 'N/A' ? session.parking_slot : (
                            <span className="text-gray-400 italic">Not assigned</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

