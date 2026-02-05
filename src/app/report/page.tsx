import type { Metadata } from 'next'
import { ReportPageClient } from '@/components/report/report-page-client'

export const metadata: Metadata = {
  title: '診断レポート出力 - PDF形式',
  description:
    '木造住宅の耐震診断結果をPDFレポートとして出力。簡易診断・精密診断の結果と補強提案をダウンロードできます。',
  openGraph: {
    title: '診断レポート出力 - PDF形式',
    description:
      '木造住宅の耐震診断結果をPDFレポートとして出力。簡易診断・精密診断の結果をダウンロードできます。',
  },
  alternates: {
    canonical: '/report',
  },
}

export default function ReportPage() {
  return <ReportPageClient />
}
