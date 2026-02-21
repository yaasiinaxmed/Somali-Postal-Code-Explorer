import { Suspense } from 'react'
import MapApp from '@/components/map-app'
import { SOMALI_POSTAL_CODES } from '@/data/postal-codes'

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      <Suspense fallback={<div className="min-h-screen w-full bg-background" />}>
        <MapApp initialData={SOMALI_POSTAL_CODES} />
      </Suspense>
    </main>
  )
}
