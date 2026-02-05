import type { Metadata } from 'next'
import { BuildingInfoPageClient } from '@/components/diagnosis/detailed/building-info-page-client'

export const metadata: Metadata = {
  title: '精密耐震診断 - 建物基本情報入力',
  description:
    '木造住宅の精密耐震診断（一般診断法）。建築士・専門家向けの上部構造評点（Iw）算出ツール。2012年改訂版 精密診断法1に準拠。',
  openGraph: {
    title: '精密耐震診断 - 建物基本情報入力',
    description:
      '木造住宅の精密耐震診断（一般診断法）。建築士・専門家向けの上部構造評点（Iw）算出ツール。',
  },
  alternates: {
    canonical: '/detailed/building-info',
  },
}

export default function BuildingInfoPage() {
  return <BuildingInfoPageClient />
}
