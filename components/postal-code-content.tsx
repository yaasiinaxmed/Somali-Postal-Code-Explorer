'use client'

import { useState, useMemo } from 'react'
import SearchBar from '@/components/search-bar'
import PostalCodeTable from '@/components/postal-code-table'
import PostalCodeMap from '@/components/postal-code-map'
import { PostalCode } from '@/data/postal-codes'

interface PostalCodeContentProps {
  initialData: PostalCode[]
}

export default function PostalCodeContent({ initialData }: PostalCodeContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>()

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialData
    }

    const query = searchQuery.toLowerCase()
    return initialData.filter(
      (item) =>
        item.city.toLowerCase().includes(query) ||
        item.postalCode.toLowerCase().includes(query) ||
        item.region.toLowerCase().includes(query)
    )
  }, [searchQuery, initialData])

  // Get unique cities for map
  const uniqueCities = useMemo(() => {
    const cityMap = new Map<string, PostalCode>()
    filteredData.forEach((item) => {
      if (!cityMap.has(item.city)) {
        cityMap.set(item.city, item)
      }
    })
    return Array.from(cityMap.values())
  }, [filteredData])

  return (
    <>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Map Section */}
      <section className="border-b border-border bg-card py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">City Locations</h2>
          <PostalCodeMap data={uniqueCities} selectedCity={selectedCity} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-semibold text-foreground">
                {filteredData.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-foreground">
                {initialData.length}
              </span>{' '}
              postal codes
            </p>
          </div>

          {filteredData.length > 0 ? (
            <PostalCodeTable 
              data={filteredData}
              onCitySelect={setSelectedCity}
              selectedCity={selectedCity}
            />
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                No postal codes found matching "{searchQuery}"
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try searching with a different city name or postal code
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
