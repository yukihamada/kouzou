'use client'

import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateDetailedDiagnosis } from '@/lib/calc/upper-structure-score'
import { generateReinforcementPlan } from '@/lib/calc/reinforcement'
import type { BuildingInfo } from '@/types/building'

export default function FoundationPage() {
  const {
    buildingInfo,
    walls,
    deteriorationItems,
    setResult,
    setReinforcementPlan,
    prevStep,
  } = useDetailedDiagnosisStore()
  const router = useRouter()

  const canRun =
    walls.length > 0 &&
    buildingInfo.constructionMethod &&
    buildingInfo.numberOfFloors &&
    buildingInfo.roofWeight &&
    buildingInfo.floorShapes?.floor1

  const handleRunDiagnosis = () => {
    if (!canRun) return
    try {
      const fullBuildingInfo = buildingInfo as BuildingInfo
      const result = calculateDetailedDiagnosis(
        fullBuildingInfo,
        walls,
        deteriorationItems
      )
      setResult(result)

      const plan = generateReinforcementPlan(result)
      setReinforcementPlan(plan)

      router.push('/detailed/result')
    } catch {
      alert('診断の実行中にエラーが発生しました。入力データを確認してください。')
    }
  }

  const handleBack = () => {
    prevStep()
    router.push('/detailed/deterioration')
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Step 5: 診断実行</h1>

      <Card>
        <CardHeader>
          <CardTitle>入力データの確認</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            構法: {buildingInfo.constructionMethod === 'conventional' ? '在来工法' : '2×4'}
          </p>
          <p>階数: {buildingInfo.numberOfFloors}階建て</p>
          <p>
            屋根:{' '}
            {buildingInfo.roofWeight === 'heavy'
              ? '重い'
              : buildingInfo.roofWeight === 'moderate'
                ? 'やや重い'
                : '軽い'}
          </p>
          <p>壁数: {walls.length}本</p>
          <p>
            劣化チェック:{' '}
            {deteriorationItems.filter((i) => i.checked).length}項目
          </p>
          <p>地域係数 Z: {buildingInfo.regionCoefficientZ}</p>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          入力データに基づき、上部構造評点（Iw）を算出します。
          すべての入力が正確であることを確認してください。
        </p>
      </div>

      {!canRun && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            {walls.length === 0
              ? '壁データが入力されていません。Step 3で壁を追加してください。'
              : '建物基本情報が不足しています。Step 1から入力し直してください。'}
          </p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>
          戻る
        </Button>
        <Button onClick={handleRunDiagnosis} size="lg" disabled={!canRun}>
          診断を実行する
        </Button>
      </div>
    </div>
  )
}
