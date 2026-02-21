'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { CityGroup } from '@/lib/postal-map'
import { formatSomaliaPostalCode } from '@/lib/somalia-postal'
import 'leaflet/dist/leaflet.css'

interface SomaliaMapFullScreenProps {
  cities: CityGroup[]
  selectedCityId?: string
  onCitySelect: (cityId: string) => void
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

export default function SomaliaMapFullScreen({
  cities,
  selectedCityId,
  onCitySelect,
}: SomaliaMapFullScreenProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  useEffect(() => {
    if (!mapContainer.current || map.current) {
      return
    }

    const mapInstance = L.map(mapContainer.current, {
      zoomControl: false,
      minZoom: 5,
      maxZoom: 12,
      worldCopyJump: false,
    }).setView([5.4, 45.3], 6)

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20,
      }
    ).addTo(mapInstance)

    map.current = mapInstance

    return () => {
      Object.values(markersRef.current).forEach((marker) => {
        marker.remove()
      })
      markersRef.current = {}
      mapInstance.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current) {
      return
    }

    const mapInstance = map.current

    Object.values(markersRef.current).forEach((marker) => {
      marker.remove()
    })
    markersRef.current = {}

    cities.forEach((city) => {
      const isSelected = selectedCityId === city.id
      const escapedCityName = escapeHtml(city.city)
      const escapedRegion = escapeHtml(city.region)
      const escapedRegionCode = escapeHtml(city.regionCode)
      const firstFormattedPostalCode = formatSomaliaPostalCode(
        city.postalCodes[0] ?? ''
      )
      const visiblePostalCodes = city.postalCodes.slice(0, 3)
      const hiddenCodesCount = Math.max(
        city.postalCodes.length - visiblePostalCodes.length,
        0
      )
      const codeCountLabel = `${city.postalCodes.length} code${
        city.postalCodes.length === 1 ? '' : 's'
      }`
      const postalCodePills = visiblePostalCodes
        .map((code) => {
          const formattedCode = formatSomaliaPostalCode(code)
          return `<span class="postal-popup-pill">${escapedRegionCode} ${escapeHtml(formattedCode)}</span>`
        })
        .join('')
      const moreCodesPill =
        hiddenCodesCount > 0
          ? `<span class="postal-popup-pill is-more">+${hiddenCodesCount}</span>`
          : ''

      const customIcon = L.divIcon({
        html: `
          <span class="postal-marker ${isSelected ? 'is-selected' : ''}">
            <span class="postal-marker-pulse"></span>
            <span class="postal-marker-core"></span>
          </span>
        `,
        className: 'postal-marker-shell',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
        tooltipAnchor: [0, -14],
      })

      const marker = L.marker([city.latitude, city.longitude], {
        icon: customIcon,
        riseOnHover: true,
      })

      marker.bindTooltip(
        `
          <div class="postal-tooltip-card">
            ${escapedRegionCode} ${escapeHtml(firstFormattedPostalCode)}
          </div>
        `,
        {
          direction: 'top',
          offset: [0, -6],
          opacity: 1,
          className: 'postal-tooltip',
          sticky: false,
        }
      )

      marker.bindPopup(
        `
          <div class="postal-popup-card">
            <div class="postal-popup-title-row">
              <p class="postal-popup-city">${escapedCityName}</p>
              <span class="postal-popup-region-code">${escapedRegionCode}</span>
            </div>
            <p class="postal-popup-region">${escapedRegion}</p>
            <p class="postal-popup-code">${codeCountLabel}</p>
            <div class="postal-popup-pills">${postalCodePills}${moreCodesPill}</div>
          </div>
        `,
        {
          closeButton: false,
          maxWidth: 240,
          className: 'postal-popup',
        }
      )

      marker
        .on('mouseover', () => {
          marker.openTooltip()
        })
        .on('mouseout', () => {
          marker.closeTooltip()
        })
        .on('click', () => {
          onCitySelect(city.id)
          marker.openPopup()
        })
        .addTo(mapInstance)

      if (isSelected) {
        marker.openPopup()
        mapInstance.flyTo([city.latitude, city.longitude], 8, {
          duration: 0.4,
        })
      }

      const key = city.id
      markersRef.current[key] = marker
    })

    if (cities.length === 1) {
      mapInstance.setView([cities[0].latitude, cities[0].longitude], 8, {
        animate: false,
      })
      return
    }

    if (!selectedCityId && cities.length > 0) {
      const bounds = L.latLngBounds(
        cities.map((city) => [city.latitude, city.longitude] as L.LatLngTuple)
      )
      mapInstance.fitBounds(bounds, {
        padding: [90, 90],
        maxZoom: 7,
      })
    }
  }, [cities, onCitySelect, selectedCityId])

  return (
    <div
      ref={mapContainer}
      className="postal-map h-full w-full"
      style={{
        background:
          'linear-gradient(140deg, rgba(226, 232, 240, 0.5), rgba(186, 230, 253, 0.65))',
      }}
    />
  )
}
