import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by city, postal code, or region..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-input bg-background py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}
