import type { Metadata } from 'next'
import { SimpleResultPageClient } from '@/components/diagnosis/simple/simple-result-page-client'

export const metadata: Metadata = {
  title: '簡易耐震診断 - 診断結果',
  description:
    '木造住宅の簡易耐震診断結果。10問の問診による評価点と耐震性の判定結果を確認できます。',
  openGraph: {
    title: '簡易耐震診断 - 診断結果',
    description:
      '木造住宅の簡易耐震診断結果。10問の問診による評価点と耐震性の判定結果を確認できます。',
  },
  alternates: {
    canonical: '/simple/result',
  },
}

export default function SimpleResultPage() {
  return <SimpleResultPageClient />
}
