'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { PostalCode } from '@/data/postal-codes'
import {
  type CityGroup,
  buildCityGroups,
  buildRegionSummaries,
  filterCityGroups,
} from '@/lib/postal-map'
import {
  buildSomaliaAddressLines,
  formatSomaliaPostalCode,
  SOMALIA_REGION_CODES,
} from '@/lib/somalia-postal'
import { useIsMobile } from '@/hooks/use-mobile'
import SomaliFlag from '@/components/somali-flag'
import { Check, Copy, Layers, MapPin, Search, X } from 'lucide-react'

const SomaliaMapFullScreen = dynamic(
  () => import('@/components/somalia-map-fullscreen'),
  {
    loading: () => <div className="h-full w-full animate-pulse bg-slate-100" />,
    ssr: false,
  }
)

interface MapAppProps {
  initialData: PostalCode[]
}

const ALL_REGIONS = 'All regions'

export default function MapApp({ initialData }: MapAppProps) {
  const isMobile = useIsMobile()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState(ALL_REGIONS)
  const [selectedCityId, setSelectedCityId] = useState<string>()
  const [copiedPostalCodeKey, setCopiedPostalCodeKey] = useState<string>()
  const [responseMessage, setResponseMessage] = useState(
    'Choose a city from the map or directory to view postal codes.'
  )

  const cityGroups = useMemo(() => buildCityGroups(initialData), [initialData])

  const searchedCities = useMemo(
    () => filterCityGroups(cityGroups, searchQuery),
    [cityGroups, searchQuery]
  )

  const filteredCities = useMemo(() => {
    if (selectedRegion === ALL_REGIONS) {
      return searchedCities
    }

    return searchedCities.filter((city) => city.region === selectedRegion)
  }, [searchedCities, selectedRegion])

  const selectedCity = useMemo(
    () => cityGroups.find((city) => city.id === selectedCityId),
    [cityGroups, selectedCityId]
  )

  const selectedAddressLines = useMemo(() => {
    if (!selectedCity || selectedCity.postalCodes.length === 0) {
      return []
    }

    const primaryPostalCode = selectedCity.postalCodes[0]
    return buildSomaliaAddressLines({
      recipient: 'Hassan O. Omar',
      poBox: primaryPostalCode,
      city: selectedCity.city,
      region: selectedCity.region,
      postalCode: primaryPostalCode,
    })
  }, [selectedCity])

  const cityById = useMemo(
    () => new Map(cityGroups.map((city) => [city.id, city])),
    [cityGroups]
  )

  const regionCodeByName = useMemo(() => {
    const map = new Map<string, string>()
    cityGroups.forEach((city) => {
      map.set(city.region, city.regionCode)
    })
    return map
  }, [cityGroups])

  const availableRegions = useMemo(() => {
    const regions = new Set<string>()
    cityGroups.forEach((city) => regions.add(city.region))
    return Array.from(regions).sort((a, b) => a.localeCompare(b))
  }, [cityGroups])

  const regionSummaries = useMemo(
    () => buildRegionSummaries(filteredCities),
    [filteredCities]
  )

  const filteredUniquePostalCodes = useMemo(() => {
    const codes = new Set<string>()
    filteredCities.forEach((city) => {
      city.postalCodes.forEach((code) => codes.add(code))
    })
    return codes.size
  }, [filteredCities])

  useEffect(() => {
    if (!selectedCityId) {
      return
    }

    const selectedStillVisible = filteredCities.some(
      (city) => city.id === selectedCityId
    )

    if (!selectedStillVisible) {
      setSelectedCityId(undefined)
    }
  }, [filteredCities, selectedCityId])

  useEffect(() => {
    if (selectedCity) {
      setResponseMessage(
        isMobile
          ? `${selectedCity.city} selected. Tap code to copy.`
          : `${selectedCity.city} (${selectedCity.regionCode}) selected. Tap a code to copy.`
      )
      return
    }

    if (searchQuery.trim() && filteredCities.length === 0) {
      setResponseMessage(
        isMobile
          ? 'No result. Try another search.'
          : 'No match. Try another city, code, or region.'
      )
      return
    }

    if (searchQuery.trim()) {
      setResponseMessage(
        isMobile
          ? `${filteredCities.length} cities found.`
          : `${filteredCities.length} cities found. Tap one to view codes.`
      )
      return
    }

    if (selectedRegion !== ALL_REGIONS) {
      setResponseMessage(
        isMobile
          ? `${filteredCities.length} cities in ${selectedRegion}.`
          : `${filteredCities.length} cities in ${selectedRegion}.`
      )
      return
    }

    setResponseMessage(
      isMobile
        ? 'Tap a marker or city.'
        : 'Tap a marker or city. Copy codes in one click.'
    )
  }, [filteredCities.length, isMobile, searchQuery, selectedCity, selectedRegion])

  const handleCopyPostalCode = (
    postalCode: string,
    cityId: string,
    regionCode: string
  ) => {
    const formattedCode = formatSomaliaPostalCode(postalCode)
    const formattedPostalLabel = `${regionCode} ${formattedCode}`
    navigator.clipboard.writeText(formattedPostalLabel)
    const copyKey = `${cityId}|${postalCode}`
    setCopiedPostalCodeKey(copyKey)
    const cityName = cityById.get(cityId)?.city
    setResponseMessage(
      `Copied ${formattedPostalLabel}${cityName ? ` for ${cityName}` : ''}.`
    )
    setTimeout(() => setCopiedPostalCodeKey(undefined), 2000)
  }

  const handleCopyAllCodes = (city: CityGroup) => {
    const payload = city.postalCodes
      .map((code) => `${city.regionCode} ${formatSomaliaPostalCode(code)}`)
      .join('\n')
    navigator.clipboard.writeText(payload)
    setResponseMessage(`Copied all ${city.postalCodes.length} codes for ${city.city}.`)
  }

  const handleCopyAddress = (city: CityGroup) => {
    const lines = buildSomaliaAddressLines({
      recipient: 'Hassan O. Omar',
      poBox: city.postalCodes[0] ?? '',
      city: city.city,
      region: city.region,
      postalCode: city.postalCodes[0] ?? '',
    })
    navigator.clipboard.writeText(lines.join('\n'))
    setResponseMessage(`Address copied for ${city.city}.`)
  }

  const regionCoverageContent = (
    <>
      <h2 className="font-semibold text-slate-900">Region Coverage</h2>
      <div className="mt-3 space-y-2">
        {regionSummaries.map((region) => (
          <div
            key={`${region.regionCode}-${region.region}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <div>
              <p className="font-medium text-slate-900">
                {region.region}
                <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
                  {region.regionCode}
                </span>
              </p>
              <p className="text-xs text-slate-500">{region.cityCount} cities</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-700">
              <MapPin className="h-3.5 w-3.5" />
              {region.postalCodeCount} codes
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Official Regional Codes
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SOMALIA_REGION_CODES.map((region) => (
            <div
              key={region.code}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5"
            >
              <span className="rounded bg-sky-100 px-1.5 py-0.5 text-xs font-bold text-sky-800">
                {region.code}
              </span>
              <span className="text-[11px] font-semibold text-slate-700">
                {region.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#f8fafc_45%,_#eef2ff_100%)] py-4 sm:py-6">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                SOMALI POSTAL DIRECTORY
              </p>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1">
                <SomaliFlag className="h-4 w-6 rounded-[2px] shadow-sm" />
                <span className="text-xs font-semibold text-sky-800">
                  Somalia
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Complete Postal Code Explorer
              </h1>
              <p className="hidden text-sm text-slate-600 sm:block sm:text-base">
                Redesigned to show one entry per city, with postal codes grouped
                together to remove duplicate-looking records.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold tracking-wide text-white shadow-lg sm:flex">
              <SomaliFlag className="h-3 w-5 rounded-[2px]" />
              <Layers className="h-4 w-4" />
              Deduplicated View
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search city, region, or postal code..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-slate-900 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedRegion(ALL_REGIONS)
                setSelectedCityId(undefined)
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Reset filters
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 sm:px-4 sm:py-3">
            <p className="text-xs font-semibold text-sky-700 sm:text-[11px] sm:uppercase sm:tracking-wide">
              {isMobile ? 'Status' : 'Live Response'}
            </p>
            <p className="text-sm text-slate-700">{responseMessage}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-600">
              Quick region filters
            </p>
            <div className="mt-2 -mx-1 overflow-x-auto px-1">
              <div className="inline-flex gap-2 pb-1">
                {[ALL_REGIONS, ...availableRegions].map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${selectedRegion === region
                        ? 'border-sky-300 bg-sky-100 text-sky-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    {region === ALL_REGIONS
                      ? region
                      : `${regionCodeByName.get(region) ?? '--'} ${region}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Cities Shown
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {filteredCities.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Regions
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {regionSummaries.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Postal Codes
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {filteredUniquePostalCodes}
              </p>
            </div>
            <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:block">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Raw Records
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {initialData.length}
              </p>
            </div>
            <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:block">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Active Region
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {selectedRegion === ALL_REGIONS
                  ? selectedRegion
                  : `${regionCodeByName.get(selectedRegion) ?? '--'} ${selectedRegion}`}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Interactive Postal Map
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {filteredCities.length} city markers
                  {selectedRegion !== ALL_REGIONS ? ` in ${selectedRegion}` : ''}.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 sm:inline-flex">
                <SomaliFlag className="h-3 w-5 rounded-[2px]" />
                <span>{filteredCities.length} cities</span>
              </div>
            </div>

            <div className="h-[24rem] sm:h-[30rem]">
              <SomaliaMapFullScreen
                cities={filteredCities}
                selectedCityId={selectedCityId}
                onCitySelect={setSelectedCityId}
              />
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white/95 shadow-xl">
            <div className="border-b border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">
                City Directory ({filteredCities.length})
              </h2>
              <p className="text-xs text-slate-500">
                Click a city to center the map and load postal-code actions.
              </p>
            </div>

            <div className="max-h-[30rem] space-y-2 overflow-y-auto p-3">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <div
                    key={city.id}
                    className={`rounded-xl border p-3 transition ${selectedCityId === city.id
                        ? 'border-sky-400 bg-sky-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCityId(city.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {city.city}
                          </p>
                          <p className="text-xs text-slate-500">
                            {city.region}
                            <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 font-semibold text-slate-700">
                              {city.regionCode}
                            </span>
                          </p>
                        </div>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                          {city.postalCodes.length} codes
                        </span>
                      </div>
                    </button>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(isMobile && selectedCityId !== city.id
                        ? city.postalCodes.slice(0, 1)
                        : city.postalCodes
                      ).map((postalCode) => {
                        const copyKey = `${city.id}|${postalCode}`
                        const wasCopied = copiedPostalCodeKey === copyKey
                        const formattedPostalCode =
                          formatSomaliaPostalCode(postalCode)

                        return (
                          <button
                            key={postalCode}
                            type="button"
                            onClick={() =>
                              handleCopyPostalCode(
                                postalCode,
                                city.id,
                                city.regionCode
                              )
                            }
                            className={`rounded-md border px-2 py-1 text-xs transition ${wasCopied
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                              }`}
                          >
                            {wasCopied ? (
                              <span className="inline-flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Copied
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <Copy className="h-3 w-3" />
                                {city.regionCode} {formattedPostalCode}
                              </span>
                            )}
                          </button>
                        )
                      })}
                      {isMobile && selectedCityId !== city.id && (
                        <button
                          type="button"
                          onClick={() => setSelectedCityId(city.id)}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700"
                        >
                          View more
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-700">
                    No city matched "{searchQuery}".
                  </p>
                  <p className="text-xs text-slate-500">
                    Try another city name, region, or postal code.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedRegion(ALL_REGIONS)
                    }}
                    className="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                  >
                    Clear search and region
                  </button>
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl">
            <h2 className="font-semibold text-slate-900">Selected City</h2>
            {selectedCity ? (
              <div className="mt-3 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">
                      {selectedCity.city}
                    </p>
                    <p className="text-sm text-slate-600">
                      {selectedCity.region}
                      <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
                        {selectedCity.regionCode}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <div className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {selectedCity.totalEntries} source rows
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopyAddress(selectedCity)}
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                      >
                        <Copy className="h-3 w-3" />
                        Copy address
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyAllCodes(selectedCity)}
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                      >
                        <Copy className="h-3 w-3" />
                        Copy all
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedCity.postalCodes.map((postalCode) => {
                    const copyKey = `${selectedCity.id}|${postalCode}`
                    const wasCopied = copiedPostalCodeKey === copyKey
                    const formattedPostalCode = formatSomaliaPostalCode(postalCode)

                    return (
                      <button
                        key={postalCode}
                        type="button"
                        onClick={() =>
                          handleCopyPostalCode(
                            postalCode,
                            selectedCity.id,
                            selectedCity.regionCode
                          )
                        }
                        className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition ${wasCopied
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white'
                          }`}
                      >
                        {wasCopied ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {selectedCity.regionCode} {formattedPostalCode}
                      </button>
                    )
                  })}
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Address format
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-5 sm:text-sm">
                    {selectedAddressLines.join('\n')}
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p>
                    Latitude: <strong>{selectedCity.latitude.toFixed(4)}</strong>
                  </p>
                  <p>
                    Longitude:{' '}
                    <strong>{selectedCity.longitude.toFixed(4)}</strong>
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                Select any city from the map or directory to see details.
              </p>
            )}
          </div>

          {isMobile ? (
            <details className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                Region Coverage and Codes
              </summary>
              <div className="mt-3">{regionCoverageContent}</div>
            </details>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl">
              {regionCoverageContent}
            </div>
          )}
        </section>

        <footer className="mt-2 pb-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 shadow-sm backdrop-blur-sm">
            <SomaliFlag className="h-4 w-6 rounded-[2px] shadow-sm" />
            <span className="text-sm font-medium text-slate-600">
              Built with{' '}
              <span className="text-red-500">❤️</span>
              {' '}for{' '}
              <span className="font-semibold text-slate-800">Somalia</span>
            </span>
            <SomaliFlag className="h-4 w-6 rounded-[2px] shadow-sm" />
          </div>
        </footer>
      </main>
    </div>
  )
}
