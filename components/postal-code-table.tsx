'use client'

interface PostalCodeData {
  city: string
  postalCode: string
  region: string
}

interface PostalCodeTableProps {
  data: PostalCodeData[]
  onCitySelect?: (city: string) => void
  selectedCity?: string
}

export default function PostalCodeTable({ data, onCitySelect, selectedCity }: PostalCodeTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              City
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              Postal Code
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              Region
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onCitySelect?.(row.city)}
              className={`border-b border-border last:border-b-0 cursor-pointer transition-colors ${
                selectedCity === row.city
                  ? 'bg-primary/10'
                  : 'hover:bg-muted/50'
              }`}
            >
              <td className="px-6 py-4 text-sm text-foreground font-medium">
                {row.city}
              </td>
              <td className="px-6 py-4 text-sm text-foreground font-mono">
                <span className="rounded bg-accent/10 px-3 py-1 text-accent">
                  {row.postalCode}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {row.region}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
