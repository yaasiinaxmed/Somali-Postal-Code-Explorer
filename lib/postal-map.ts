import { PostalCode } from '@/data/postal-codes'
import {
  getSomaliaRegionCode,
  getSomaliaRegionName,
} from '@/lib/somalia-postal'

export interface CityGroup {
  id: string
  city: string
  region: string
  regionCode: string
  latitude: number
  longitude: number
  postalCodes: string[]
  totalEntries: number
}

export interface RegionSummary {
  region: string
  regionCode: string
  cityCount: number
  postalCodeCount: number
}

const normalize = (value: string) => value.trim().toLowerCase()

const sortPostalCodes = (codes: string[]) =>
  [...codes].sort((a, b) => {
    const numberA = Number(a)
    const numberB = Number(b)
    const aIsNumber = Number.isFinite(numberA)
    const bIsNumber = Number.isFinite(numberB)

    if (aIsNumber && bIsNumber) {
      return numberA - numberB
    }

    return a.localeCompare(b)
  })

export function buildCityGroups(data: PostalCode[]): CityGroup[] {
  const groups = new Map<
    string,
    {
      city: string
      region: string
      regionCode: string
      latitudeSum: number
      longitudeSum: number
      totalEntries: number
      postalCodes: Set<string>
    }
  >()

  data.forEach((item) => {
    const city = item.city.trim()
    const rawRegion = item.region.trim()
    const regionCode = getSomaliaRegionCode(rawRegion)
    const region = getSomaliaRegionName(regionCode) ?? rawRegion
    const regionKey = regionCode !== '--' ? regionCode : normalize(rawRegion)
    const key = `${normalize(city)}|${regionKey}`

    if (!groups.has(key)) {
      groups.set(key, {
        city,
        region,
        regionCode,
        latitudeSum: 0,
        longitudeSum: 0,
        totalEntries: 0,
        postalCodes: new Set<string>(),
      })
    }

    const group = groups.get(key)!
    group.latitudeSum += item.latitude
    group.longitudeSum += item.longitude
    group.totalEntries += 1
    group.postalCodes.add(item.postalCode.trim())
  })

  return Array.from(groups.entries())
    .map(([id, group]) => ({
      id,
      city: group.city,
      region: group.region,
      regionCode: group.regionCode,
      latitude: group.latitudeSum / group.totalEntries,
      longitude: group.longitudeSum / group.totalEntries,
      postalCodes: sortPostalCodes(Array.from(group.postalCodes)),
      totalEntries: group.totalEntries,
    }))
    .sort((a, b) => a.city.localeCompare(b.city))
}

export function filterCityGroups(groups: CityGroup[], query: string): CityGroup[] {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return groups
  }

  return groups.filter((city) => {
    const cityMatch = normalize(city.city).includes(normalizedQuery)
    const regionMatch = normalize(city.region).includes(normalizedQuery)
    const regionCodeMatch = normalize(city.regionCode).includes(normalizedQuery)
    const postalCodeMatch = city.postalCodes.some((code) =>
      normalize(code).includes(normalizedQuery)
    )

    return cityMatch || regionMatch || regionCodeMatch || postalCodeMatch
  })
}

export function buildRegionSummaries(groups: CityGroup[]): RegionSummary[] {
  const regionMap = new Map<
    string,
    {
      region: string
      regionCode: string
      cities: number
      postalCodes: Set<string>
    }
  >()

  groups.forEach((group) => {
    const key = group.regionCode !== '--' ? group.regionCode : normalize(group.region)

    if (!regionMap.has(key)) {
      regionMap.set(key, {
        region: group.region,
        regionCode: group.regionCode,
        cities: 0,
        postalCodes: new Set<string>(),
      })
    }

    const region = regionMap.get(key)!
    region.cities += 1
    group.postalCodes.forEach((code) => region.postalCodes.add(code))
  })

  return Array.from(regionMap.values())
    .map((region) => ({
      region: region.region,
      regionCode: region.regionCode,
      cityCount: region.cities,
      postalCodeCount: region.postalCodes.size,
    }))
    .sort((a, b) => b.cityCount - a.cityCount || a.region.localeCompare(b.region))
}
