import type { DetailedDiagnosisResult } from '@/types/diagnosis'
import type {
  ReinforcementPlan,
  ReinforcementSuggestion,
  ReinforcementType,
} from '@/types/reinforcement'
import { REINFORCEMENT_COST_REFERENCE } from '@/lib/constants/reinforcement-costs'

/**
 * 診断結果から補強提案を生成する
 */
export function generateReinforcementPlan(
  result: DetailedDiagnosisResult
): ReinforcementPlan {
  const suggestions: ReinforcementSuggestion[] = []
  const currentIw = result.overallIw
  const targetIw = 1.0
  const deficiency = Math.max(0, targetIw - currentIw)

  // 最弱方向を特定
  const weakest = [...result.directionalResults].sort(
    (a, b) => a.iw - b.iw
  )[0]

  // 劣化が大きい場合
  if (result.deteriorationScore.dK < 0.9) {
    const deterioratedCount = result.deteriorationScore.items.filter(
      (i) => i.checked && i.exists
    ).length
    suggestions.push(
      buildSuggestion('deterioration_repair', 'high', deterioratedCount, '劣化による耐力低減を改善するため')
    )
  }

  // 壁量不足の場合（Iw < 1.0）
  if (deficiency > 0 && weakest) {
    const neededStrength = weakest.qr * deficiency
    const wallsNeeded = Math.ceil(neededStrength / 5.88) // 4.5×9cm片筋交い1m相当

    suggestions.push(
      buildSuggestion(
        'add_shear_wall',
        deficiency > 0.3 ? 'high' : 'medium',
        Math.max(1, Math.ceil(wallsNeeded / 2)),
        `${weakest.floor}階${weakest.direction}方向の壁量が不足（Iw=${weakest.iw.toFixed(2)}）`
      )
    )

    suggestions.push(
      buildSuggestion(
        'add_brace',
        'medium',
        Math.max(1, wallsNeeded),
        `壁耐力の追加が必要（不足分 約${neededStrength.toFixed(1)}kN）`
      )
    )
  }

  // 偏心率が大きい場合
  const highEccentricity = result.directionalResults.find(
    (r) => r.eccentricityRatio > 0.15
  )
  if (highEccentricity) {
    suggestions.push(
      buildSuggestion(
        'wall_panel',
        'medium',
        2,
        `${highEccentricity.floor}階${highEccentricity.direction}方向の偏心率が高い（Re=${highEccentricity.eccentricityRatio.toFixed(2)}）`
      )
    )
  }

  // 接合部金物
  if (
    result.buildingInfo.buildYear < 2000 &&
    currentIw < 1.5
  ) {
    suggestions.push(
      buildSuggestion(
        'joint_hardware',
        currentIw < 1.0 ? 'high' : 'low',
        8,
        '2000年以前の建物のため接合部金物の追加を推奨'
      )
    )
  }

  // 重い屋根の場合
  if (result.buildingInfo.roofWeight === 'heavy' && currentIw < 1.0) {
    suggestions.push(
      buildSuggestion('roof_lighten', 'medium', 1, '重い屋根を軽量化して必要耐力を低減')
    )
  }

  // 基礎が弱い場合
  if (
    result.buildingInfo.foundationType === 'stone' ||
    result.buildingInfo.foundationType === 'unreinforced_concrete'
  ) {
    suggestions.push(
      buildSuggestion('foundation_repair', 'high', 1, '基礎の耐震性が不十分')
    )
  }

  // 優先度でソート
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const totalCostMin = suggestions.reduce((s, r) => s + r.estimatedCostMin, 0)
  const totalCostMax = suggestions.reduce((s, r) => s + r.estimatedCostMax, 0)
  const totalIwImprovement = suggestions.reduce(
    (s, r) => s + r.estimatedIwImprovement,
    0
  )

  return {
    suggestions,
    totalCostMin,
    totalCostMax,
    currentIw,
    estimatedIwAfter: Math.min(currentIw + totalIwImprovement, 2.0),
  }
}

function buildSuggestion(
  type: ReinforcementType,
  priority: 'high' | 'medium' | 'low',
  quantity: number,
  reason: string
): ReinforcementSuggestion {
  const ref = REINFORCEMENT_COST_REFERENCE[type]
  return {
    type,
    labelJa: ref.labelJa,
    descriptionJa: ref.descriptionJa,
    priority,
    estimatedCostMin: ref.costMin * quantity,
    estimatedCostMax: ref.costMax * quantity,
    estimatedIwImprovement: ref.iwImprovementPerUnit * quantity,
    unit: ref.unit,
    quantity,
    reason,
  }
}
