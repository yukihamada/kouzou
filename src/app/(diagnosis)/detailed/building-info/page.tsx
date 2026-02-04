'use client'

import { BuildingInfoForm } from '@/components/diagnosis/detailed/building-info-form'

export default function BuildingInfoPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Step 1: 建物基本情報</h1>
      <BuildingInfoForm />
    </div>
  )
}
