# 🇸🇴 Somali Postal Code Explorer

> **A modern, interactive postal code directory for Somalia** — browse every region, search cities, view postal codes on an interactive map, and copy formatted addresses in one click.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)
[![Vercel Analytics](https://img.shields.io/badge/Vercel-Analytics-000?logo=vercel)](https://vercel.com/analytics)

---

## 📸 Overview

The **Somali Postal Code Explorer** is a full-stack web application built with Next.js App Router that provides a clean, searchable, and interactive directory of postal codes across all 18 regions of Somalia. It de-duplicates raw postal records so each city appears exactly once, with all its codes grouped together for a better user experience.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Map** | Leaflet-powered map showing city markers; click to select a city |
| 🔍 **Live Search** | Filter by city name, region name, region code, or postal code |
| 📋 **One-click Copy** | Copy individual codes, all codes, or a full formatted address |
| 🏷️ **Region Filter** | Quick-filter pills for all 18 Somali regions |
| 📊 **Stats Dashboard** | Live counts of cities shown, regions, and unique postal codes |
| 📱 **Responsive** | Fully optimised for mobile, tablet, and desktop |

---

## 🗂️ Project Structure

```
somali-postel-code/
├── app/
│   ├── layout.tsx          # Root layout with metadata, fonts & analytics
│   ├── page.tsx            # Entry point — loads postal data & renders MapApp
│   └── globals.css         # Global Tailwind CSS base styles
│
├── components/
│   ├── map-app.tsx          # 🧠 Main application component (search, filter, UX)
│   ├── somalia-map-fullscreen.tsx  # Leaflet map with city markers
│   ├── map-leaflet.tsx      # Low-level Leaflet wrapper
│   ├── postal-code-content.tsx    # Postal code display card
│   ├── postal-code-map.tsx  # Embedded map tile
│   ├── postal-code-table.tsx      # Tabular view of codes
│   ├── search-bar.tsx       # Reusable search bar
│   ├── somali-flag.tsx      # SVG Somali flag asset
│   ├── theme-provider.tsx   # next-themes provider wrapper
│   └── ui/                  # shadcn/ui component library (57 components)
│
├── data/
│   └── postal-codes.ts      # 📦 Source dataset — typed PostalCode[] array
│
├── lib/
│   ├── postal-map.ts        # City grouping, filtering & region summary logic
│   ├── somalia-postal.ts    # Region codes, address formatting utilities
│   └── utils.ts             # Shared utility helpers (cn, etc.)
│
├── hooks/
│   └── use-mobile.ts        # Responsive breakpoint hook
│
├── styles/                  # Additional CSS modules (if any)
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS v4 configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18.x |
| pnpm | ≥ 9.x (recommended) |

> You can also use `npm` or `yarn` — just replace `pnpm` commands accordingly.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/somali-postel-code.git
cd somali-postel-code

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — the app hot-reloads on every file save.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js development server with hot reload |
| `pnpm build` | Create an optimised production build |
| `pnpm start` | Run the built production server locally |
| `pnpm lint` | Run ESLint across the codebase |

---

## 🏗️ Architecture & Data Flow

```
data/postal-codes.ts          ← Static typed PostalCode[] dataset
        │
        ▼
app/page.tsx                  ← Server Component: passes data as props
        │
        ▼
components/map-app.tsx        ← Client Component: state, search, filter logic
        ├── lib/postal-map.ts         buildCityGroups()   — dedup + group by city
        │                             filterCityGroups()  — live search
        │                             buildRegionSummaries() — region stats
        │
        ├── lib/somalia-postal.ts     getSomaliaRegionCode()  — normalise region names
        │                             formatSomaliaPostalCode() — format codes
        │                             buildSomaliaAddressLines() — full address format
        │
        ├── SomaliaMapFullScreen      ← Leaflet map (dynamically imported, no SSR)
        └── City Directory sidebar    ← Scrollable list with copy actions
```

### Key Data Structures

```ts
// Raw source record (data/postal-codes.ts)
interface PostalCode {
  city: string
  postalCode: string
  region: string
  latitude: number
  longitude: number
}

// Deduplicated city group (lib/postal-map.ts)
interface CityGroup {
  id: string          // "cityname|regionCode" composite key
  city: string
  region: string
  regionCode: string  // 2-letter ISO-style code e.g. "BN", "WG"
  latitude: number    // averaged from all raw records
  longitude: number
  postalCodes: string[]  // sorted, deduplicated
  totalEntries: number
}
```

---

## 🌍 Region Code Reference

All 18 official Somali regions are supported with their 2-letter codes:

| Code | Region | Code | Region |
|------|--------|------|--------|
| `AD` | Awdal | `MD` | Mudug |
| `BK` | Bakool | `NG` | Nugaal |
| `BN` | Banaadir | `SG` | Sanaag |
| `BR` | Bari | `SD` | Shabeellada Dhexe |
| `BY` | Bay | `SH` | Shabeellada Hoose |
| `GG` | Galgaduud | `SL` | Sool |
| `GD` | Gedo | `TG` | Togdheer |
| `HR` | Hiiraan | `WG` | Waqooyi Galbeed |
| `JD` | Jubbada Dhexe | `JH` | Jubbada Hoose |

---

## 📦 Tech Stack

### Runtime & Framework

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.1.6 | App framework (App Router) |
| `react` / `react-dom` | 19.2 | UI library |
| `typescript` | 5.7.3 | Type safety |

### UI & Styling

| Package | Purpose |
|---|---|
| `tailwindcss` v4 | Utility-first CSS |
| `@radix-ui/*` | Accessible headless component primitives |
| `lucide-react` | Icon library |
| `class-variance-authority` + `clsx` + `tailwind-merge` | Dynamic class utilities |
| `next-themes` | Dark/light theme toggling |
| `tw-animate-css` | Animation utilities |

### Mapping

| Package | Purpose |
|---|---|
| `leaflet` + `@types/leaflet` | Interactive map tiles and markers |

### Forms & Validation

| Package | Purpose |
|---|---|
| `react-hook-form` + `@hookform/resolvers` | Form state management |
| `zod` | Schema validation |

### Data & Utilities

| Package | Purpose |
|---|---|
| `date-fns` | Date formatting |
| `recharts` | Chart components |
| `embla-carousel-react` | Carousel component |
| `@vercel/analytics` | Page analytics |

---

## ➕ Adding or Updating Postal Codes

All postal data lives in a single TypeScript file:

```ts
// data/postal-codes.ts
export const SOMALI_POSTAL_CODES: PostalCode[] = [
  {
    city: 'Mogadishu',
    postalCode: '1001',
    region: 'Banaadir',     // ← Use the region's English or Somali name
    latitude: 2.0469,
    longitude: 45.3182,
  },
  // ...
]
```

**Rules:**
- `postalCode` should be a numeric string (e.g. `"1001"`).
- `region` is normalised automatically — accepted aliases are defined in `lib/somalia-postal.ts`.
- Duplicate `city + region` rows are automatically merged. You can safely add multiple rows for the same city with different postal codes.
- After editing, run `pnpm dev` to see changes immediately — no rebuild required.

---

## 🗺️ Map Configuration

The Leaflet map is loaded **dynamically with SSR disabled** to avoid `window is not defined` errors during server rendering:

```ts
// components/map-app.tsx
const SomaliaMapFullScreen = dynamic(
  () => import('@/components/somalia-map-fullscreen'),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-slate-100" /> }
)
```

Map tiles are provided by **OpenStreetMap**. No API key is needed.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fsomali-postel-code)

1. Push your code to GitHub.
2. Import the repository in [Vercel Dashboard](https://vercel.com/dashboard).
3. Vercel auto-detects Next.js — no configuration needed.
4. Click **Deploy**.

> Vercel Analytics is already wired up via `@vercel/analytics`. It will activate automatically once deployed on Vercel.

### Manual / Self-Hosted

```bash
# Build the production bundle
pnpm build

# Start the production server
pnpm start
```

The app listens on port `3000` by default. Use a reverse proxy (Nginx, Caddy) to serve it publicly.

### Docker (Optional)

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
docker build -t somali-postal .
docker run -p 3000:3000 somali-postal
```

---

## 🧪 Development Tips

### Path Aliases

Configured in `tsconfig.json` — use `@/` to import from the project root:

```ts
import { SOMALI_POSTAL_CODES } from '@/data/postal-codes'
import { buildCityGroups } from '@/lib/postal-map'
```

### Component Library

This project uses **shadcn/ui** components located in `components/ui/`. To add a new component:

```bash
npx shadcn@latest add <component-name>
```

### TypeScript Build Errors

`next.config.mjs` has `ignoreBuildErrors: true` for faster iteration. For production, it is recommended to re-enable strict type checking:

```js
// next.config.mjs
typescript: {
  ignoreBuildErrors: false,   // ← re-enable for a production release
}
```

---

## 📁 Environment Variables

This project has **no required environment variables** — it is fully static with no database or external API calls.

If you add external services in the future, create a `.env.local` file (never commit it):

```env
# Example future variables
NEXT_PUBLIC_MAP_TILE_URL=https://...
SOME_API_SECRET=...
```

---

## 🤝 Contributing

1. **Fork** this repository.
2. Create a feature branch: `git checkout -b feat/add-more-cities`
3. Commit your changes: `git commit -m "feat: add postal codes for Hiiraan region"`
4. Push and open a **Pull Request**.

### Contribution Ideas

- [ ] Add missing cities for under-represented regions
- [ ] Add Somali language (`so`) translations for region names
- [ ] Export to CSV / JSON download feature
- [ ] Add address validation utility
- [ ] Add unit tests for `lib/postal-map.ts` and `lib/somalia-postal.ts`

---

## 📄 License

This project is open source. See [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgements

- Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)
- Icons by [Lucide](https://lucide.dev/)
- Map rendering by [Leaflet](https://leafletjs.com/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)

---

<div align="center">
  Built with ❤️ for Somalia
</div>
