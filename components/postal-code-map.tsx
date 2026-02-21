'use client'

import dynamic from 'next/dynamic'
import { PostalCode } from '@/data/postal-codes'

const MapComponent = dynamic(() => import('./map-leaflet'), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted flex items-center justify-center">Loading map...</div>,
})

interface PostalCodeMapProps {
  data: PostalCode[]
  selectedCity?: string
}

export default function PostalCodeMap({ data, selectedCity }: PostalCodeMapProps) {
  // Get unique city locations
  const uniqueCities = Array.from(
    new Map(data.map((item) => [item.city, item])).values()
  )

  return (
    <div className="w-full">
      <MapComponent cities={uniqueCities} selectedCity={selectedCity} />
    </div>
  )
}
