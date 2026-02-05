'use client'

import { useState, useEffect } from 'react'
import { BuildingInfoForm } from '@/components/diagnosis/detailed/building-info-form'
import { ResumeDialog } from '@/components/ui/resume-dialog'
import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'

export function BuildingInfoPageClient() {
  const { hasData, reset } = useDetailedDiagnosisStore()
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // クライアントサイドでのみ実行されるようにする（Zustandのpersistがhydrateされた後）
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && hasData()) {
      setShowResumeDialog(true)
    }
  }, [isHydrated, hasData])

  const handleResume = () => {
    setShowResumeDialog(false)
  }

  const handleStartOver = () => {
    reset()
    setShowResumeDialog(false)
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
