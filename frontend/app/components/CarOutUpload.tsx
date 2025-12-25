'use client'

import { useRef, useState } from 'react'
import { Camera, UploadCloud, CheckCircle, AlertCircle, LogOut } from 'lucide-react'

interface CarOutUploadProps {
  onUploaded?: (payload: {
    rfid_id: string
    license_plate: string | null
    parking_slot: string | null
    total_money?: number | null
  }) => void
}

export default function CarOutUpload({ onUploaded }: CarOutUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [rfid, setRfid] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null)
  const [parkingSlot, setParkingSlot] = useState<string | null>(null)
  const [totalMoney, setTotalMoney] = useState<number | null>(null)

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setFile(file)
  }

  const handleUpload = async () => {
    if (!file) {
      setStatus('error')
      setMessage('Please select an image first')
      return
    }
    if (!rfid.trim()) {
      setStatus('error')
      setMessage('Please enter an RFID ID')
      return
    }

    try {
      setStatus('uploading')
      setMessage(null)
      setDetectedPlate(null)
      setParkingSlot(null)
      setTotalMoney(null)

      // For out-upload, we need to send the image as raw bytes (like ESP32 does)
      // First, convert file to blob, then to array buffer
      const imageBlob = await file.arrayBuffer()
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/esp32/out-upload?rfid_id=${encodeURIComponent(rfid.trim())}`
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: imageBlob,
      })

      const text = await res.text()

      if (!res.ok) {
        // Try to parse error message from response
        let errorMessage = `Upload failed (${res.status})`
        try {
          const errorData = JSON.parse(text)
          if (errorData.detail) {
            errorMessage = errorData.detail
          }
        } catch {
          if (text) {
            errorMessage = text
          }
        }
        throw new Error(errorMessage)
      }

      const data = text ? JSON.parse(text) : {}
      
      if (data.success) {
        setStatus('success')
        setMessage(data.message || 'Vehicle exit successful')
        setDetectedPlate(data.license_plate || null)
        setParkingSlot(data.parking_slot || null)
        setTotalMoney(data.total_money || null)

        if (onUploaded) {
          onUploaded({
            rfid_id: data.rfid_id ?? rfid.trim(),
            license_plate: data.license_plate ?? null,
            parking_slot: data.parking_slot ?? null,
            total_money: data.total_money ?? null,
          })
        }
      } else {
        throw new Error(data.message || 'Vehicle exit failed')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Upload failed')
      setDetectedPlate(null)
      setParkingSlot(null)
      setTotalMoney(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-red-700 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LogOut size={20} />
          <h3 className="font-semibold">CAR OUT (Upload)</h3>
        </div>
      </div>

      <div className="flex flex-col p-6 space-y-4">
        <div className="w-full max-w-md aspect-video bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden self-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Uploaded car out"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-400">
              <Camera size={48} className="mx-auto mb-2 opacity-60" />
              <p className="text-sm">No image uploaded</p>
              <p className="text-xs mt-1">Click the button below to upload a car image</p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 max-w-md self-center w-full">
          <label className="text-sm text-gray-600">RFID ID</label>
          <input
            type="text"
            value={rfid}
            onChange={(e) => setRfid(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
            placeholder="Enter RFID ID"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col sm:flex-row gap-3 self-center">
          <button
            type="button"
            onClick={handleChooseFile}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <UploadCloud size={20} />
            <span>Select Image</span>
          </button>

          <button
            type="button"
            disabled={status === 'uploading'}
            onClick={handleUpload}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <LogOut size={20} />
            <span>{status === 'uploading' ? 'Processing...' : 'Process Exit'}</span>
          </button>
        </div>

        {message && (
          <div
            className={`flex items-center space-x-2 text-sm px-3 py-2 rounded ${
              status === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {status === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{message}</span>
          </div>
        )}

        {detectedPlate && status === 'success' && (
          <div className="text-sm text-gray-700 px-3 py-2 bg-white border rounded self-center">
            <div className="space-y-1">
              <div>
                <span className="font-semibold">Detected plate:</span> {detectedPlate}
              </div>
              {parkingSlot && (
                <div>
                  <span className="font-semibold">Parking slot:</span> {parkingSlot}
                </div>
              )}
              {totalMoney !== null && (
                <div className="pt-2 border-t mt-2">
                  <span className="font-semibold text-green-600">Total amount:</span>{' '}
                  <span className="text-lg font-bold text-green-700">
                    {totalMoney.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


