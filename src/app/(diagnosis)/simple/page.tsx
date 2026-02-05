import type { Metadata } from 'next'
import { SimpleDiagnosisClient } from '@/components/diagnosis/simple/simple-diagnosis-client'

export const metadata: Metadata = {
  title: '簡易耐震診断 - 10問で分かる木造住宅の耐震性',
  description:
    '10問の問診に答えるだけで、木造住宅の耐震性の目安が分かる簡易診断ツール。専門知識不要、約5分で診断完了。「誰でもできるわが家の耐震診断」に準拠。',
  openGraph: {
    title: '簡易耐震診断 - 10問で分かる木造住宅の耐震性',
    description:
      '10問の問診に答えるだけで、木造住宅の耐震性の目安が分かる簡易診断ツール。専門知識不要、約5分で診断完了。',
  },
  alternates: {
    canonical: '/simple',
  },
}

export default function SimpleDiagnosisPage() {
  return <SimpleDiagnosisClient />
}
