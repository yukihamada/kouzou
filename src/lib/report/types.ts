import type { SimpleRating } from '@/types/simple-diagnosis'
import type { StructuralRating } from '@/types/diagnosis'
import type { JointSpecification } from '@/types/wall'
import type { DeteriorationCategory } from '@/types/deterioration'

// ===== 共通 =====

export type TrafficLightColor = 'red' | 'yellow' | 'green'

export interface TrafficLightRating {
  color: TrafficLightColor
  labelJa: string
}

// ===== 簡易レポート =====

/** ① 総合判定ランク */
export interface SimpleOverallRating {
  score: number
  maxScore: number
  rating: SimpleRating
  ratingLabelJa: string
  trafficLight: TrafficLightRating
}

/** ② 建物基本データ */
export interface SimpleBuildingData {
  items: Array<{ labelJa: string; valueJa: string; warning?: boolean }>
}

/** ③ 不合格チェック項目 */
export interface FailedCheckItem {
  questionNumber: number
  questionJa: string
  riskDescriptionJa: string
}

/** ④ 過去の地震との比較 */
export interface EarthquakeComparisonItem {
  name: string
  year: number
  magnitude: number
  maxIntensity: string
  casualties: string
  riskDescriptionJa: string
  riskLevel: 'high' | 'medium' | 'low'
}

/** ⑤ 今後のロードマップ */
export interface RoadmapStep {
  order: number
  titleJa: string
  descriptionJa: string
}

/** 簡易レポート全体 */
export interface SimpleReportContent {
  overallRating: SimpleOverallRating
  buildingData: SimpleBuildingData
  failedChecks: FailedCheckItem[]
  earthquakeComparison: EarthquakeComparisonItem[]
  roadmap: RoadmapStep[]
}

// ===== 精密レポート =====

/** 方向別・階別の結果行 */
export interface DirectionalResultRow {
  floor: 1 | 2
  direction: 'X' | 'Y'
  qu: number
  qr: number
  iw: number
  ratingLabelJa: string
  eccentricityRatio: number
  eccentricityFactor: number
  deteriorationFactor: number
}

/** A. 表紙・サマリー */
export interface DetailedCoverSection {
  iwScore: number
  ratingLabelJa: string
  ratingDescriptionJa: string
  rating: StructuralRating
  buildingOverview: Array<{ labelJa: string; valueJa: string }>
  diagnosisDate: string
  directionalResults: DirectionalResultRow[]
}

/** B-1. 壁の量 */
export interface WallQuantityRow {
  labelJa: string
  totalLength: number
  totalStrength: number
  required: number
  ratio: number
}

export interface WallQuantitySection {
  rows: WallQuantityRow[]
}

/** B-2. 壁の配置バランス */
export interface EccentricityRow {
  floor: 1 | 2
  direction: 'X' | 'Y'
  eccentricityRatio: number
  eccentricityFactor: number
  judgmentJa: string
}

export interface WallBalanceSection {
  rows: EccentricityRow[]
  explanationJa: string
}

/** B-3. 接合部の仕様 */
export interface JointSummaryRow {
  spec: JointSpecification
  labelJa: string
  count: number
  percentage: number
}

export interface JointSection {
  rows: JointSummaryRow[]
  totalCount: number
}

/** B-4. 劣化度 */
export interface DeteriorationCategoryRow {
  category: DeteriorationCategory
  labelJa: string
  checkedCount: number
  totalCount: number
  itemLabels: string[]
}

export interface DeteriorationSection {
  categories: DeteriorationCategoryRow[]
  dK: number
  totalDeteriorationPoints: number
  totalExistencePoints: number
}

/** C. 補強計画 */
export interface ReinforcementPlanContent {
  targetIw: number
  targetLabelJa: string
  currentIw: number
  estimatedIwAfter: number
  suggestions: Array<{
    priority: 'high' | 'medium' | 'low'
    labelJa: string
    quantity: string
    costRange: string
    reason: string
  }>
  totalCostRange: string
}

export interface ReinforcementSection {
  planA: ReinforcementPlanContent | null
  planB: ReinforcementPlanContent | null
}

/** D. 行政情報 */
export interface AdministrativeSection {
  hazardMapNote: string
  subsidyTemplateJa: string
}

/** E. 免責事項 */
export interface DisclaimerSection {
  items: string[]
  references: string[]
}

/** 精密レポート全体 */
export interface DetailedReportContent {
  cover: DetailedCoverSection
  wallQuantity: WallQuantitySection
  wallBalance: WallBalanceSection
  joints: JointSection
  deterioration: DeteriorationSection
  reinforcement: ReinforcementSection
  administrative: AdministrativeSection
  disclaimer: DisclaimerSection
}
