import type { Metadata } from 'next'
import { WallSpecPageClient } from '@/components/diagnosis/detailed/wall-spec-page-client'

export const metadata: Metadata = {
  title: '精密耐震診断 - 壁仕様入力',
  description:
    '木造住宅の精密耐震診断。耐力壁の仕様・配置を入力して、壁量と壁倍率を計算します。',
  openGraph: {
    title: '精密耐震診断 - 壁仕様入力',
    description:
      '木造住宅の精密耐震診断。耐力壁の仕様・配置を入力して、壁量と壁倍率を計算します。',
  },
  alternates: {
    canonical: '/detailed/wall-spec',
  },
}

export default function WallSpecPage() {
  return <WallSpecPageClient />
}
