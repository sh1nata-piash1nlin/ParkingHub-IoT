'use client'

import { useState, useEffect } from 'react'
import { Camera, Wifi, WifiOff } from 'lucide-react'

interface CameraViewProps {
  title: string
  streamUrl?: string
  fallbackImage?: string
}

export default function CameraView({ title, streamUrl, fallbackImage }: CameraViewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageKey, setImageKey] = useState(0)

  // Refresh image every 2 seconds if it's a static URL
  useEffect(() => {
    if (streamUrl && !streamUrl.includes('stream')) {
      const interval = setInterval(() => {
        setImageKey(prev => prev + 1)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [streamUrl])

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const displayUrl = streamUrl || fallbackImage || ''

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera size={20} />
          <h3 className="font-semibold">{title}</h3>
        </div>
        {hasError ? (
          <WifiOff size={18} className="text-red-400" />
        ) : (
          <Wifi size={18} className="text-green-400" />
        )}
      </div>
      
      <div className="relative bg-black aspect-video flex items-center justify-center">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="text-center text-gray-400 p-8">
            <Camera size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm">Camera offline</p>
            <p className="text-xs mt-2">Unable to connect to camera stream</p>
          </div>
        ) : (
          <img
            key={imageKey}
            src={displayUrl}
            alt={title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            style={{ maxHeight: '400px' }}
          />
        )}
      </div>
    </div>
  )
}

