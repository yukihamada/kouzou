'use client'

import { Badge } from '@/components/ui/badge'
import type { StructuralRating } from '@/types/diagnosis'
import { RATING_INFO } from '@/lib/calc/upper-structure-score'

const colorClasses: Record<StructuralRating, string> = {
  safe: 'bg-green-100 text-green-800 border-green-300',
  generally_safe: 'bg-blue-100 text-blue-800 border-blue-300',
  somewhat_danger: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  collapse_risk: 'bg-red-100 text-red-800 border-red-300',
}

interface RatingBadgeProps {
  rating: StructuralRating
  size?: 'sm' | 'lg'
}

export function RatingBadge({ rating, size = 'sm' }: RatingBadgeProps) {
  const info = RATING_INFO[rating]
  return (
    <Badge
      className={`${colorClasses[rating]} ${
        size === 'lg' ? 'text-lg px-4 py-1' : ''
      }`}
    >
      {info.labelJa}
    </Badge>
  )
}
