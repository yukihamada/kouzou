import type { Metadata } from 'next'
import { ResultPageClient } from '@/components/diagnosis/detailed/result-page-client'

export const metadata: Metadata = {
  title: '精密耐震診断 - 診断結果',
  description:
    '木造住宅の精密耐震診断結果。上部構造評点（Iw）、壁量充足率、偏心率、劣化度を確認できます。',
  openGraph: {
    title: '精密耐震診断 - 診断結果',
    description:
      '木造住宅の精密耐震診断結果。上部構造評点（Iw）、壁量充足率、偏心率、劣化度を確認できます。',
  },
  alternates: {
    canonical: '/detailed/result',
  },
}

export default function DetailedResultPage() {
  return <ResultPageClient />
}
