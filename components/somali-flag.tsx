interface SomaliFlagProps {
  className?: string
}

const STAR_CENTER_X = 1.5
const STAR_CENTER_Y = 1
const STAR_OUTER_RADIUS = 0.56
const STAR_INNER_RADIUS = STAR_OUTER_RADIUS * 0.382

const starPoints = Array.from({ length: 10 }, (_, index) => {
  const isOuterPoint = index % 2 === 0
  const radius = isOuterPoint ? STAR_OUTER_RADIUS : STAR_INNER_RADIUS
  const angle = (-90 + index * 36) * (Math.PI / 180)
  const x = STAR_CENTER_X + radius * Math.cos(angle)
  const y = STAR_CENTER_Y + radius * Math.sin(angle)
  return `${x.toFixed(4)},${y.toFixed(4)}`
}).join(' ')

export default function SomaliFlag({ className }: SomaliFlagProps) {
  return (
    <svg
      viewBox="0 0 3 2"
      aria-label="Flag of Somalia"
      role="img"
      className={className}
    >
      <rect width="3" height="2" fill="#4189dd" />
      <polygon points={starPoints} fill="#ffffff" />
    </svg>
  )
}
