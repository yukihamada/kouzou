'use client'

import { WallSpecForm } from '@/components/diagnosis/detailed/wall-spec-form'

export default function WallSpecPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Step 3: 壁仕様入力</h1>
      <WallSpecForm />
    </div>
  )
}
