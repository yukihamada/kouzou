'use client'

import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'
import { DetailedResultDisplay } from '@/components/diagnosis/detailed/detailed-result-display'
import { useRouter } from 'next/navigation'

export function ResultPageClient() {
  const { result, reinforcementPlan, walls, deteriorationItems, reset } = useDetailedDiagnosisStore()
  const router = useRouter()

  if (!result) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="text-zinc-500">
          診断結果がありません。先に診断を実行してください。
        </p>
      </div>
    )
  }

  const handleReset = () => {
    reset()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push('/detailed/building-info')
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <DetailedResultDisplay
        result={result}
        reinforcementPlan={reinforcementPlan}
        walls={walls}
        deteriorationItems={deteriorationItems}
        onReset={handleReset}
      />
    </div>
  )
}
