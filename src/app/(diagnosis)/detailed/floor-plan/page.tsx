import type { Metadata } from 'next'
import { FloorPlanPageClient } from '@/components/diagnosis/detailed/floor-plan-page-client'

export const metadata: Metadata = {
  title: '精密耐震診断 - 平面図・寸法入力',
  description:
    '木造住宅の精密耐震診断。建物の平面形状・寸法を入力して、床面積と形状係数を計算します。',
  openGraph: {
    title: '精密耐震診断 - 平面図・寸法入力',
    description:
      '木造住宅の精密耐震診断。建物の平面形状・寸法を入力して、床面積と形状係数を計算します。',
  },
  alternates: {
    canonical: '/detailed/floor-plan',
  },
}

export default function FloorPlanPage() {
  return <FloorPlanPageClient />
}
