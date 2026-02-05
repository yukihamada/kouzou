import type { Metadata } from 'next'
import { DeteriorationPageClient } from '@/components/diagnosis/detailed/deterioration-page-client'

export const metadata: Metadata = {
  title: '精密耐震診断 - 劣化度調査',
  description:
    '木造住宅の精密耐震診断。建物の劣化状況をチェックして、劣化度低減係数を算出します。',
  openGraph: {
    title: '精密耐震診断 - 劣化度調査',
    description:
      '木造住宅の精密耐震診断。建物の劣化状況をチェックして、劣化度低減係数を算出します。',
  },
  alternates: {
    canonical: '/detailed/deterioration',
  },
}

export default function DeteriorationPage() {
  return <DeteriorationPageClient />
}
