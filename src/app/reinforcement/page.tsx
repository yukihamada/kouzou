import type { Metadata } from 'next'
import { ReinforcementPageClient } from '@/components/reinforcement/reinforcement-page-client'

export const metadata: Metadata = {
  title: '耐震補強提案・概算見積もり',
  description:
    '木造住宅の耐震補強提案と概算費用見積もり。診断結果に基づいた補強工法の提案と、補強後の上部構造評点の見込みを確認できます。',
  openGraph: {
    title: '耐震補強提案・概算見積もり',
    description:
      '木造住宅の耐震補強提案と概算費用見積もり。診断結果に基づいた補強工法の提案と費用概算を確認できます。',
  },
  alternates: {
    canonical: '/reinforcement',
  },
}

export default function ReinforcementPage() {
  return <ReinforcementPageClient />
}
