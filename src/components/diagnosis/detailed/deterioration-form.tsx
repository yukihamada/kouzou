'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'
import { useRouter } from 'next/navigation'
import {
  createDeteriorationItems,
  DETERIORATION_TEMPLATES,
} from '@/lib/constants/deterioration-items'
import { calculateDeteriorationFactor } from '@/lib/calc/deterioration'
import type { DeteriorationCategory } from '@/types/deterioration'
import { useAutoSaveNotification } from '@/hooks/use-auto-save-notification'

const categoryLabels: Record<DeteriorationCategory, string> = {
  foundation: '基礎',
  exterior_wall: '外壁',
  roof: '屋根',
  living_room: '居室・廊下',
  bathroom: '浴室',
  balcony: 'バルコニー',
  attic: '小屋裏',
  under_floor: '床下',
  gutter: '雨樋',
}

export function DeteriorationForm() {
  const {
    deteriorationItems,
    setDeteriorationItems,
    toggleDeteriorationItem,
    nextStep,
    prevStep,
    lastSavedAt,
  } = useDetailedDiagnosisStore()
  const router = useRouter()

  useAutoSaveNotification(lastSavedAt)

  useEffect(() => {
    if (deteriorationItems.length === 0) {
      setDeteriorationItems(createDeteriorationItems())
    }
  }, [deteriorationItems.length, setDeteriorationItems])

  const detResult = calculateDeteriorationFactor(deteriorationItems)

  const categories = Array.from(
    new Set(DETERIORATION_TEMPLATES.map((t) => t.category))
  )

  const handleNext = () => {
    nextStep()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push('/detailed/foundation')
  }

  const handleBack = () => {
    prevStep()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push('/detailed/wall-spec')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">劣化度調査</h2>
        <Badge
          variant="outline"
          className={
            detResult.dK >= 0.9
              ? 'border-green-500 text-green-700'
              : detResult.dK >= 0.8
                ? 'border-yellow-500 text-yellow-700'
                : 'border-red-500 text-red-700'
          }
        >
          劣化低減係数 dK = {detResult.dK.toFixed(2)}
        </Badge>
      </div>

      {categories.map((cat) => {
        const items = deteriorationItems.filter((i) => i.category === cat)
        if (items.length === 0) return null

        return (
          <Card key={cat}>
            <CardHeader>
              <CardTitle className="text-base">
                {categoryLabels[cat]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-zinc-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleDeteriorationItem(item.id)}
                    className="mt-1"
                  />
                  <div>
                    <Label className="cursor-pointer">{item.labelJa}</Label>
                    <p className="text-xs text-zinc-500">
                      {item.descriptionJa}（配点: {item.points}点）
                    </p>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>
        )
      })}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="min-h-[44px]">
          戻る
        </Button>
        <Button onClick={handleNext} className="min-h-[44px]">次へ：診断実行</Button>
      </div>
    </div>
  )
}
