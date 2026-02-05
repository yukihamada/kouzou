'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import { BuildingInfoForm } from '@/components/diagnosis/detailed/building-info-form'
import { ResumeDialog } from '@/components/ui/resume-dialog'
import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'

// Zustandのhydration状態を監視するためのカスタムフック
function useHasDataAfterHydration() {
  const { hasData } = useDetailedDiagnosisStore()

  // サーバーサイドでは常にfalseを返す
  const subscribe = useCallback((callback: () => void) => {
    // Zustandのpersist rehydrateイベントをリッスン
    const unsubscribe = useDetailedDiagnosisStore.persist.onFinishHydration(callback)
    return unsubscribe
  }, [])

  const getSnapshot = useCallback(() => hasData(), [hasData])
  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function BuildingInfoPageClient() {
  const { reset } = useDetailedDiagnosisStore()
  const hasDataAfterHydration = useHasDataAfterHydration()
  const [dialogDismissed, setDialogDismissed] = useState(false)

  const showResumeDialog = hasDataAfterHydration && !dialogDismissed

  const handleResume = () => {
    setDialogDismissed(true)
  }

  const handleStartOver = () => {
    reset()
    setDialogDismissed(true)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Step 1: 建物基本情報</h1>
      <BuildingInfoForm />
      <ResumeDialog
        open={showResumeDialog}
        onResume={handleResume}
        onStartOver={handleStartOver}
      />
    </div>
  )
}
