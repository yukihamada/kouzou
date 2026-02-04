import type { BuildingInfo } from './building'
import type { DeteriorationResult } from './deterioration'

/** 上部構造評点の判定 */
export type StructuralRating =
  | 'safe'             // 1.5以上: 倒壊しない
  | 'generally_safe'   // 1.0〜1.5: 一応倒壊しない
  | 'somewhat_danger'  // 0.7〜1.0: 倒壊する可能性がある
  | 'collapse_risk'    // 0.7未満: 倒壊する可能性が高い

export interface StructuralRatingInfo {
  rating: StructuralRating
  labelJa: string
  color: string
  minScore: number
}

/** 方向別・階別の診断結果 */
export interface DirectionalResult {
  floor: 1 | 2
  direction: 'X' | 'Y'
  qu: number              // 保有耐力 (kN)
  qr: number              // 必要耐力 (kN)
  edQu: number            // 低減後保有耐力 (kN)
  iw: number              // 上部構造評点
  rating: StructuralRating
  eccentricityRatio: number
  eccentricityFactor: number
  deteriorationFactor: number
}

/** 壁量サマリー */
export interface WallSummary {
  floor1X: WallDirectionSummary
  floor1Y: WallDirectionSummary
  floor2X?: WallDirectionSummary
  floor2Y?: WallDirectionSummary
}

export interface WallDirectionSummary {
  totalLength: number
  totalStrength: number
  required: number
  ratio: number
}

/** 診断結果の総合 */
export interface DetailedDiagnosisResult {
  buildingInfo: BuildingInfo
  directionalResults: DirectionalResult[]
  overallIw: number
  overallRating: StructuralRating
  deteriorationScore: DeteriorationResult
  wallSummary: WallSummary
}
