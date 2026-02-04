'use client'

import type { StructuralRating } from '@/types/diagnosis'

const ratingColors: Record<StructuralRating, string> = {
  safe: '#16a34a',
  generally_safe: '#2563eb',
  somewhat_danger: '#eab308',
  collapse_risk: '#dc2626',
}

interface ScoreGaugeProps {
  iw: number
  rating: StructuralRating
  size?: number
}

export function ScoreGauge({ iw, rating, size = 200 }: ScoreGaugeProps) {
  const color = ratingColors[rating]
  const maxIw = 2.0
  const normalizedIw = Math.min(iw / maxIw, 1)
  const angle = normalizedIw * 180
  const radius = size / 2 - 20
  const cx = size / 2
  const cy = size / 2 + 10

  // SVG arc
  const startAngle = -180
  const endAngle = startAngle + angle
  const startRad = (startAngle * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180

  const x1 = cx + radius * Math.cos(startRad)
  const y1 = cy + radius * Math.sin(startRad)
  const x2 = cx + radius * Math.cos(endRad)
  const y2 = cy + radius * Math.sin(endRad)

  const largeArc = angle > 180 ? 1 : 0

  return (
    <svg width={size} height={size / 2 + 40} viewBox={`0 0 ${size} ${size / 2 + 40}`}>
      {/* 背景の半円 */}
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke="#e4e4e7"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* 値の弧 */}
      {angle > 0 && (
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
        />
      )}
      {/* 中央テキスト */}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize="32"
        fontWeight="bold"
        fill={color}
      >
        {iw.toFixed(2)}
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fontSize="12" fill="#71717a">
        上部構造評点 Iw
      </text>
    </svg>
  )
}
