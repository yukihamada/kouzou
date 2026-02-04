import type { DetailedDiagnosisResult } from '@/types/diagnosis'
import type { ReinforcementPlan } from '@/types/reinforcement'
import type { WallSegment, JointSpecification } from '@/types/wall'
import type { DeteriorationItem, DeteriorationCategory } from '@/types/deterioration'
import type {
  DetailedReportContent,
  DetailedCoverSection,
  WallQuantitySection,
  WallBalanceSection,
  EccentricityRow,
  JointSection,
  JointSummaryRow,
  DeteriorationSection,
  DeteriorationCategoryRow,
  ReinforcementSection,
  ReinforcementPlanContent,
  AdministrativeSection,
  DisclaimerSection,
} from './types'
import { RATING_INFO } from '@/lib/calc/upper-structure-score'
import {
  DETERIORATION_CATEGORY_LABELS,
  JOINT_SPEC_LABELS,
  SUBSIDY_TEMPLATE,
  HAZARD_MAP_NOTE,
  DISCLAIMER_ITEMS,
  DISCLAIMER_REFERENCES,
} from './constants'

const ROOF_LABELS: Record<string, string> = {
  heavy: '重い屋根（瓦等）',
  moderate: 'やや重い屋根',
  light: '軽い屋根（金属板等）',
}

const FOUNDATION_LABELS: Record<string, string> = {
  rebar_concrete_spread: '鉄筋コンクリート布基礎',
  rebar_concrete_mat: '鉄筋コンクリートべた基礎',
  unreinforced_concrete: '無筋コンクリート布基礎',
  stone: '玉石基礎',
  other: 'その他',
}

const GROUND_LABELS: Record<string, string> = {
  good: '良好',
  normal: '普通',
  soft: '軟弱',
}

function formatYen(amount: number): string {
  if (amount >= 10000) {
    return `約${(amount / 10000).toFixed(0)}万円`
  }
  return `${amount.toLocaleString()}円`
}

/** A. 表紙・サマリー */
function buildCover(result: DetailedDiagnosisResult): DetailedCoverSection {
  const info = result.buildingInfo
  const ratingInfo = RATING_INFO[result.overallRating]

  const isOldCode = info.buildYear < 1981
  const buildYearNote = isOldCode ? `${info.buildYear}年（旧耐震基準）` : `${info.buildYear}年（新耐震基準）`

  return {
    iwScore: result.overallIw,
    ratingLabelJa: ratingInfo.labelJa,
    ratingDescriptionJa: ratingInfo.descriptionJa,
    rating: result.overallRating,
    buildingOverview: [
      { labelJa: '診断日', valueJa: info.diagnosisDate },
      { labelJa: '所有者', valueJa: info.ownerName || '—' },
      { labelJa: '住所', valueJa: info.address || '—' },
      { labelJa: '構法', valueJa: info.constructionMethod === 'conventional' ? '在来工法（木造軸組）' : '枠組壁工法（2×4）' },
      { labelJa: '建築年', valueJa: buildYearNote },
      { labelJa: '階数', valueJa: `${info.numberOfFloors}階建て` },
      { labelJa: '屋根', valueJa: ROOF_LABELS[info.roofWeight] || info.roofWeight },
      { labelJa: '基礎', valueJa: FOUNDATION_LABELS[info.foundationType] || '—' },
      { labelJa: '地盤', valueJa: GROUND_LABELS[info.groundType] || '—' },
      { labelJa: '地域係数 Z', valueJa: `${info.regionCoefficientZ}` },
      { labelJa: '1階床面積', valueJa: `${info.floorAreas.floor1} m²` },
      ...(info.floorAreas.floor2 != null
        ? [{ labelJa: '2階床面積', valueJa: `${info.floorAreas.floor2} m²` }]
        : []),
    ],
    diagnosisDate: info.diagnosisDate,
    directionalResults: result.directionalResults.map((r) => ({
      floor: r.floor,
      direction: r.direction,
      qu: r.qu,
      qr: r.qr,
      iw: r.iw,
      ratingLabelJa: RATING_INFO[r.rating].labelJa,
      eccentricityRatio: r.eccentricityRatio,
      eccentricityFactor: r.eccentricityFactor,
      deteriorationFactor: r.deteriorationFactor,
    })),
  }
}

/** B-1. 壁の量 */
function buildWallQuantity(result: DetailedDiagnosisResult): WallQuantitySection {
  const ws = result.wallSummary
  const rows = [
    { labelJa: '1階 X方向', ...ws.floor1X },
    { labelJa: '1階 Y方向', ...ws.floor1Y },
  ]
  if (ws.floor2X) {
    rows.push({ labelJa: '2階 X方向', ...ws.floor2X })
  }
  if (ws.floor2Y) {
    rows.push({ labelJa: '2階 Y方向', ...ws.floor2Y })
  }
  return { rows }
}

/** B-2. 壁の配置バランス */
function buildWallBalance(result: DetailedDiagnosisResult): WallBalanceSection {
  const rows: EccentricityRow[] = result.directionalResults.map((r) => {
    let judgmentJa: string
    if (r.eccentricityRatio <= 0.15) {
      judgmentJa = '良好（偏りなし）'
    } else if (r.eccentricityRatio <= 0.3) {
      judgmentJa = 'やや偏りあり'
    } else {
      judgmentJa = '偏りが大きい'
    }

    return {
      floor: r.floor,
      direction: r.direction,
      eccentricityRatio: r.eccentricityRatio,
      eccentricityFactor: r.eccentricityFactor,
      judgmentJa,
    }
  })

  return {
    rows,
    explanationJa:
      '偏心率(Re)は重心と剛心のずれを表します。Re ≦ 0.15で偏りなし、0.15 < Re ≦ 0.45で低減係数(eKfl)による補正が適用されます。壁をバランスよく配置することで偏心率を改善できます。',
  }
}

/** B-3. 接合部の仕様 */
function buildJointSection(walls: WallSegment[]): JointSection {
  const specs: JointSpecification[] = [
    'hardware_complete',
    'hardware_partial',
    'nailing_only',
    'none',
  ]
  const totalCount = walls.length

  const rows: JointSummaryRow[] = specs.map((spec) => {
    const count = walls.filter((w) => w.jointSpec === spec).length
    return {
      spec,
      labelJa: JOINT_SPEC_LABELS[spec] || spec,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
    }
  })

  return { rows, totalCount }
}

/** B-4. 劣化度 */
function buildDeteriorationSection(
  items: DeteriorationItem[],
  dK: number,
  totalDeteriorationPoints: number,
  totalExistencePoints: number
): DeteriorationSection {
  const categoryOrder: DeteriorationCategory[] = [
    'foundation',
    'exterior_wall',
    'roof',
    'living_room',
    'bathroom',
    'balcony',
    'gutter',
    'attic',
    'under_floor',
  ]

  const categories: DeteriorationCategoryRow[] = categoryOrder
    .map((cat) => {
      const catItems = items.filter((i) => i.category === cat && i.exists)
      if (catItems.length === 0) return null

      return {
        category: cat,
        labelJa: DETERIORATION_CATEGORY_LABELS[cat],
        checkedCount: catItems.filter((i) => i.checked).length,
        totalCount: catItems.length,
        itemLabels: catItems.filter((i) => i.checked).map((i) => i.labelJa),
      }
    })
    .filter((row): row is DeteriorationCategoryRow => row !== null)

  return {
    categories,
    dK,
    totalDeteriorationPoints,
    totalExistencePoints,
  }
}

/** C. 補強計画 */
function buildReinforcementSection(
  reinforcementPlan: ReinforcementPlan | null,
  currentIw: number
): ReinforcementSection {
  if (!reinforcementPlan || reinforcementPlan.suggestions.length === 0) {
    return { planA: null, planB: null }
  }

  // Plan A: Iw 1.0 目標（命を守る）
  const planA: ReinforcementPlanContent = {
    targetIw: 1.0,
    targetLabelJa: 'Iw ≧ 1.0（一応倒壊しない）— 命を守る最低ライン',
    currentIw,
    estimatedIwAfter: reinforcementPlan.estimatedIwAfter,
    suggestions: reinforcementPlan.suggestions
      .filter((s) => s.priority === 'high' || s.priority === 'medium')
      .map((s) => ({
        priority: s.priority,
        labelJa: s.labelJa,
        quantity: `${s.quantity}${s.unit}`,
        costRange: `${formatYen(s.estimatedCostMin)}〜${formatYen(s.estimatedCostMax)}`,
        reason: s.reason,
      })),
    totalCostRange: `${formatYen(reinforcementPlan.totalCostMin)}〜${formatYen(reinforcementPlan.totalCostMax)}`,
  }

  // Plan B: Iw 1.5 目標（家を守る）
  const planB: ReinforcementPlanContent = {
    targetIw: 1.5,
    targetLabelJa: 'Iw ≧ 1.5（倒壊しない）— 建物を守り住み続ける',
    currentIw,
    estimatedIwAfter: Math.max(reinforcementPlan.estimatedIwAfter, 1.5),
    suggestions: reinforcementPlan.suggestions.map((s) => ({
      priority: s.priority,
      labelJa: s.labelJa,
      quantity: `${s.quantity}${s.unit}`,
      costRange: `${formatYen(s.estimatedCostMin)}〜${formatYen(s.estimatedCostMax)}`,
      reason: s.reason,
    })),
    totalCostRange: `${formatYen(reinforcementPlan.totalCostMin)}〜${formatYen(reinforcementPlan.totalCostMax)}`,
  }

  return { planA, planB }
}

/** D. 行政情報 */
function buildAdministrativeSection(): AdministrativeSection {
  return {
    hazardMapNote: HAZARD_MAP_NOTE,
    subsidyTemplateJa: SUBSIDY_TEMPLATE,
  }
}

/** E. 免責事項 */
function buildDisclaimerSection(): DisclaimerSection {
  return {
    items: DISCLAIMER_ITEMS,
    references: DISCLAIMER_REFERENCES,
  }
}

/**
 * 精密診断結果からレポートコンテンツを構造化データとして生成する
 */
export function buildDetailedReportContent(
  result: DetailedDiagnosisResult,
  reinforcementPlan: ReinforcementPlan | null,
  walls: WallSegment[],
  deteriorationItems: DeteriorationItem[]
): DetailedReportContent {
  return {
    cover: buildCover(result),
    wallQuantity: buildWallQuantity(result),
    wallBalance: buildWallBalance(result),
    joints: buildJointSection(walls),
    deterioration: buildDeteriorationSection(
      deteriorationItems,
      result.deteriorationScore.dK,
      result.deteriorationScore.totalDeteriorationPoints,
      result.deteriorationScore.totalExistencePoints
    ),
    reinforcement: buildReinforcementSection(
      reinforcementPlan,
      result.overallIw
    ),
    administrative: buildAdministrativeSection(),
    disclaimer: buildDisclaimerSection(),
  }
}
