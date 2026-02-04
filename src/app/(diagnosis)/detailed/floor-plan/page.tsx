'use client'

import { FloorPlanForm } from '@/components/diagnosis/detailed/floor-plan-form'

export default function FloorPlanPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Step 2: 平面図・寸法入力</h1>
      <FloorPlanForm />
    </div>
  )
}
