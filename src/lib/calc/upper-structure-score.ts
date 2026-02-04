import type { BuildingInfo } from '@/types/building'
import type { WallSegment, WallDirection } from '@/types/wall'
import type { DeteriorationItem } from '@/types/deterioration'
import type {
  DetailedDiagnosisResult,
  DirectionalResult,
  StructuralRating,
  WallSummary,
  WallDirectionSummary,
} from '@/types/diagnosis'
import { calculateRequiredCapacity } from './required-capacity'
import {
  calculateWallStrengthSum,
  calculateWallLengthSum,
} from './wall-strength'
import { calculateEccentricity } from './eccentricity'
import { calculateDeteriorationFactor } from './deterioration'

/**
 * 上部構造評点 Iw を算出する（精密診断法1 メイン関数）
 *
 * Iw = edQu / Qr
 *   edQu = Qu × eKfl × dK
 *   Qu   = 保有耐力 (壁耐力の合計)
 *   eKfl = 偏心率による低減係数
 *   dK   = 劣化低減係数
 *   Qr   = 必要耐力
 */
export function calculateDetailedDiagnosis(
  buildingInfo: BuildingInfo,
  walls: WallSegment[],
  deteriorationItems: DeteriorationItem[]
): DetailedDiagnosisResult {
  const deteriorationScore = calculateDeteriorationFactor(deteriorationItems)
  const directions: WallDirection[] = ['X', 'Y']
  const floors: (1 | 2)[] =
    buildingInfo.numberOfFloors >= 2 ? [1, 2] : [1]

  const directionalResults: DirectionalResult[] = []

  for (const floor of floors) {
    for (const direction of directions) {
      const qu = calculateWallStrengthSum(walls, floor, direction)
      const qr = calculateRequiredCapacity(floor, buildingInfo)

      const floorShape =
        floor === 1
          ? buildingInfo.floorShapes.floor1
          : buildingInfo.floorShapes.floor2

      let eccentricityRatio = 0
      let eccentricityFactor = 1.0

      if (floorShape) {
        const ecResult = calculateEccentricity(
          walls,
          floorShape,
          floor,
          direction
        )
        eccentricityRatio = ecResult.ratio
        eccentricityFactor = ecResult.correctionFactor
      }

      const dK = deteriorationScore.dK
      const edQu = qu * eccentricityFactor * dK
      const iw = qr > 0 ? edQu / qr : 0

      directionalResults.push({
        floor,
        direction,
        qu,
        qr,
        edQu,
        iw,
        rating: getStructuralRating(iw),
        eccentricityRatio,
        eccentricityFactor,
        deteriorationFactor: dK,
      })
    }
  }

  const overallIw = Math.min(...directionalResults.map((r) => r.iw))
  const overallRating = getStructuralRating(overallIw)

  const wallSummary = buildWallSummary(walls, buildingInfo)

  return {
    buildingInfo,
    directionalResults,
    overallIw,
    overallRating,
    deteriorationScore,
    wallSummary,
  }
}

function buildWallSummary(
  walls: WallSegment[],
  buildingInfo: BuildingInfo
): WallSummary {
  const makeSummary = (
    floor: 1 | 2,
    direction: WallDirection
  ): WallDirectionSummary => {
    const totalLength = calculateWallLengthSum(walls, floor, direction)
    const totalStrength = calculateWallStrengthSum(walls, floor, direction)
    const required = calculateRequiredCapacity(floor, buildingInfo)
    const ratio = required > 0 ? totalStrength / required : 0
    return { totalLength, totalStrength, required, ratio }
  }

  const summary: WallSummary = {
    floor1X: makeSummary(1, 'X'),
    floor1Y: makeSummary(1, 'Y'),
  }

  if (buildingInfo.numberOfFloors >= 2) {
    summary.floor2X = makeSummary(2, 'X')
    summary.floor2Y = makeSummary(2, 'Y')
  }

  return summary
}

/**
 * Iw 値から構造評価を返す
 */
export function getStructuralRating(iw: number): StructuralRating {
  if (iw >= 1.5) return 'safe'
  if (iw >= 1.0) return 'generally_safe'
  if (iw >= 0.7) return 'somewhat_danger'
  return 'collapse_risk'
}

export const RATING_INFO: Record<
  StructuralRating,
  { labelJa: string; descriptionJa: string; color: string }
> = {
  safe: {
    labelJa: '倒壊しない',
    descriptionJa: '地震に対して安全な建物です。',
    color: 'green',
  },
  generally_safe: {
    labelJa: '一応倒壊しない',
    descriptionJa: '一応安全ですが、大規模地震では被害の可能性があります。',
    color: 'blue',
  },
  somewhat_danger: {
    labelJa: '倒壊する可能性がある',
    descriptionJa: '耐震性が不足しています。補強を検討してください。',
    color: 'yellow',
  },
  collapse_risk: {
    labelJa: '倒壊する可能性が高い',
    descriptionJa: '耐震性が大きく不足しています。早急な補強が必要です。',
    color: 'red',
  },
}
