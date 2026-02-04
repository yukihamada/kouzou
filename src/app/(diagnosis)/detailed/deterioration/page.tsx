'use client'

import { DeteriorationForm } from '@/components/diagnosis/detailed/deterioration-form'

export default function DeteriorationPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Step 4: 劣化度調査</h1>
      <DeteriorationForm />
    </div>
  )
}
