import type { Metadata } from 'next'
import { FoundationPageClient } from '@/components/diagnosis/detailed/foundation-page-client'

export const metadata: Metadata = {
  title: '精密耐震診断 - 診断実行',
  description:
    '木造住宅の精密耐震診断。入力データを確認し、上部構造評点（Iw）を算出します。',
  openGraph: {
    title: '精密耐震診断 - 診断実行',
    description:
      '木造住宅の精密耐震診断。入力データを確認し、上部構造評点（Iw）を算出します。',
  },
  alternates: {
    canonical: '/detailed/foundation',
  },
}

export default function FoundationPage() {
  return <FoundationPageClient />
}
