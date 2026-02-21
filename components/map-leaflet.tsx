'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PostalCode } from '@/data/postal-codes'

interface MapLeafletProps {
  cities: PostalCode[]
  selectedCity?: string
}

// Fix for leaflet marker icons
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const selectedIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [32, 51],
  iconAnchor: [16, 51],
  popupAnchor: [1, -34],
  shadowSize: [51, 51],
})

export default function MapLeaflet({ cities, selectedCity }: MapLeafletProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([5, 46], 5)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add markers for all cities
    cities.forEach((city) => {
      const isSelected = selectedCity === city.city
      const marker = L.marker([city.latitude, city.longitude], {
        icon: isSelected ? selectedIcon : customIcon,
      })
        .bindPopup(
          `<div class="font-semibold">${city.city}</div>
           <div class="text-sm text-gray-600">${city.region}</div>
           <div class="text-xs text-gray-500">Postal Code: ${city.postalCode}</div>`
        )
        .addTo(mapRef.current!)

      if (isSelected) {
        marker.openPopup()
        mapRef.current?.setView([city.latitude, city.longitude], 9)
      }

      markersRef.current.push(marker)
    })

    // Fit bounds if no city is selected
    if (!selectedCity && cities.length > 0) {
      const bounds = L.latLngBounds(cities.map((c) => [c.latitude, c.longitude]))
      mapRef.current?.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [cities, selectedCity])

  return (
    <div
      id="map"
      className="h-96 w-full rounded-lg border border-border bg-muted"
      style={{ minHeight: '400px' }}
    />
  )
}
