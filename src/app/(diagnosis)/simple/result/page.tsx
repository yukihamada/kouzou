'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSimpleDiagnosisStore } from '@/stores/simple-diagnosis-store'
import { SimpleResultDisplay } from '@/components/diagnosis/simple/simple-result-display'

export default function SimpleResultPage() {
  const router = useRouter()
  const { result, reset } = useSimpleDiagnosisStore()

  useEffect(() => {
    if (!result) {
      router.replace('/simple')
    }
  }, [result, router])

  const handleReset = () => {
    reset()
    router.push('/simple')
  }

  if (!result) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="text-center text-zinc-500">
          読み込み中...
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <SimpleResultDisplay result={result} onReset={handleReset} />
    </div>
  )
}
