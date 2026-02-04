import { describe, it, expect } from 'vitest'
import { buildDetailedReportContent } from '@/lib/report/detailed-report-content'
import type { DetailedDiagnosisResult } from '@/types/diagnosis'
import type { ReinforcementPlan } from '@/types/reinforcement'
import type { WallSegment } from '@/types/wall'
import type { DeteriorationItem } from '@/types/deterioration'
import type { BuildingInfo } from '@/types/building'

function makeBuildingInfo(overrides?: Partial<BuildingInfo>): BuildingInfo {
  return {
    constructionMethod: 'conventional',
    buildYear: 1990,
    numberOfFloors: 2,
    roofWeight: 'heavy',
    foundationType: 'rebar_concrete_spread',
    groundType: 'normal',
    regionCoefficientZ: 1.0,
    snowDepthM: 0,
    floorAreas: { floor1: 60, floor2: 50 },
    floorShapes: {
      floor1: { width: 8000, depth: 7500, isRegular: true },
      floor2: { width: 8000, depth: 6000, isRegular: true },
    },
    diagnosisDate: '2024-01-15',
    ownerName: 'テスト太郎',
    address: '東京都千代田区1-1-1',
    ...overrides,
  }
}

function makeResult(overrides?: Partial<DetailedDiagnosisResult>): DetailedDiagnosisResult {
  return {
    buildingInfo: makeBuildingInfo(),
    directionalResults: [
      {
        floor: 1, direction: 'X', qu: 120, qr: 100, edQu: 108,
        iw: 1.08, rating: 'generally_safe',
        eccentricityRatio: 0.12, eccentricityFactor: 1.0, deteriorationFactor: 0.9,
      },
      {
        floor: 1, direction: 'Y', qu: 95, qr: 100, edQu: 76,
        iw: 0.76, rating: 'somewhat_danger',
        eccentricityRatio: 0.25, eccentricityFactor: 0.89, deteriorationFactor: 0.9,
      },
      {
        floor: 2, direction: 'X', qu: 80, qr: 60, edQu: 72,
        iw: 1.2, rating: 'generally_safe',
        eccentricityRatio: 0.1, eccentricityFactor: 1.0, deteriorationFactor: 0.9,
      },
      {
        floor: 2, direction: 'Y', qu: 70, qr: 60, edQu: 63,
        iw: 1.05, rating: 'generally_safe',
        eccentricityRatio: 0.15, eccentricityFactor: 1.0, deteriorationFactor: 0.9,
      },
    ],
    overallIw: 0.76,
    overallRating: 'somewhat_danger',
    deteriorationScore: {
      items: [],
      totalDeteriorationPoints: 3,
      totalExistencePoints: 30,
      dK: 0.9,
    },
    wallSummary: {
      floor1X: { totalLength: 12, totalStrength: 120, required: 100, ratio: 1.2 },
      floor1Y: { totalLength: 8, totalStrength: 80, required: 100, ratio: 0.8 },
      floor2X: { totalLength: 9, totalStrength: 80, required: 60, ratio: 1.33 },
      floor2Y: { totalLength: 7, totalStrength: 65, required: 60, ratio: 1.08 },
    },
    ...overrides,
  }
}

function makeWalls(): WallSegment[] {
  return [
    {
      id: 'w1', floor: 1, direction: 'X', wallType: 'brace_45x90_single',
      length: 3.0, height: 2.7, jointSpec: 'hardware_complete',
      positionX: 0, positionY: 0,
    },
    {
      id: 'w2', floor: 1, direction: 'X', wallType: 'plywood_9_owari',
      length: 2.5, height: 2.7, jointSpec: 'hardware_partial',
      positionX: 4000, positionY: 0,
    },
    {
      id: 'w3', floor: 1, direction: 'Y', wallType: 'brace_30x90_single',
      length: 2.0, height: 2.7, jointSpec: 'nailing_only',
      positionX: 0, positionY: 0,
    },
    {
      id: 'w4', floor: 1, direction: 'Y', wallType: 'brace_45x90_single',
      length: 3.0, height: 2.7, jointSpec: 'none',
      positionX: 0, positionY: 4000,
    },
  ]
}

function makeDeteriorationItems(): DeteriorationItem[] {
  return [
    { id: 'd1', category: 'foundation', labelJa: '基礎のひび割れ', descriptionJa: '', points: 1, checked: true, exists: true },
    { id: 'd2', category: 'foundation', labelJa: '基礎の不同沈下', descriptionJa: '', points: 2, checked: false, exists: true },
    { id: 'd3', category: 'exterior_wall', labelJa: '外壁のひび割れ', descriptionJa: '', points: 1, checked: true, exists: true },
    { id: 'd4', category: 'roof', labelJa: '屋根の劣化', descriptionJa: '', points: 1, checked: false, exists: true },
    { id: 'd5', category: 'bathroom', labelJa: '浴室の腐食', descriptionJa: '', points: 1, checked: true, exists: true },
    { id: 'd6', category: 'balcony', labelJa: 'バルコニー腐食', descriptionJa: '', points: 1, checked: false, exists: false },
  ]
}

function makePlan(): ReinforcementPlan {
  return {
    suggestions: [
      {
        type: 'add_shear_wall',
        labelJa: '耐力壁の追加',
        descriptionJa: 'Y方向に耐力壁を追加',
        priority: 'high',
        estimatedCostMin: 150000,
        estimatedCostMax: 300000,
        estimatedIwImprovement: 0.3,
        unit: '箇所',
        quantity: 3,
        reason: 'Y方向の壁量不足',
      },
      {
        type: 'joint_hardware',
        labelJa: '接合部金物補強',
        descriptionJa: '接合部に金物を追加',
        priority: 'medium',
        estimatedCostMin: 50000,
        estimatedCostMax: 100000,
        estimatedIwImprovement: 0.1,
        unit: '箇所',
        quantity: 10,
        reason: '接合部の強度不足',
      },
      {
        type: 'deterioration_repair',
        labelJa: '劣化箇所修繕',
        descriptionJa: '劣化部分の補修',
        priority: 'low',
        estimatedCostMin: 30000,
        estimatedCostMax: 80000,
        estimatedIwImprovement: 0.05,
        unit: '箇所',
        quantity: 2,
        reason: '劣化による耐力低下',
      },
    ],
    totalCostMin: 230000,
    totalCostMax: 480000,
    currentIw: 0.76,
    estimatedIwAfter: 1.21,
  }
}

describe('buildDetailedReportContent', () => {
  // A. 表紙・サマリー
  describe('cover section', () => {
    it('includes Iw score and rating', () => {
      const content = buildDetailedReportContent(makeResult(), makePlan(), makeWalls(), makeDeteriorationItems())
      expect(content.cover.iwScore).toBe(0.76)
      expect(content.cover.ratingLabelJa).toBeTruthy()
      expect(content.cover.rating).toBe('somewhat_danger')
    })

    it('includes building overview items', () => {
      const content = buildDetailedReportContent(makeResult(), makePlan(), makeWalls(), makeDeteriorationItems())
      expect(content.cover.buildingOverview.length).toBeGreaterThanOrEqual(8)
      const labels = content.cover.buildingOverview.map((i) => i.labelJa)
      expect(labels).toContain('建築年')
      expect(labels).toContain('構法')
      expect(labels).toContain('屋根')
    })

    it('marks pre-1981 buildings as 旧耐震基準', () => {
      const result = makeResult()
      result.buildingInfo.buildYear = 1975
      const content = buildDetailedReportContent(result, null, [], [])
      const yearItem = content.cover.buildingOverview.find((i) => i.labelJa === '建築年')
      expect(yearItem?.valueJa).toContain('旧耐震基準')
    })

    it('marks post-1981 buildings as 新耐震基準', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], [])
      const yearItem = content.cover.buildingOverview.find((i) => i.labelJa === '建築年')
      expect(yearItem?.valueJa).toContain('新耐震基準')
    })
  })

  // B-1. 壁の量
  describe('wallQuantity section', () => {
    it('returns rows for each floor/direction', () => {
      const content = buildDetailedReportContent(makeResult(), null, makeWalls(), [])
      expect(content.wallQuantity.rows).toHaveLength(4) // 2 floors × 2 directions
    })

    it('returns 2 rows for single-story building', () => {
      const result = makeResult()
      result.wallSummary = {
        floor1X: { totalLength: 10, totalStrength: 100, required: 80, ratio: 1.25 },
        floor1Y: { totalLength: 8, totalStrength: 80, required: 80, ratio: 1.0 },
      }
      const content = buildDetailedReportContent(result, null, [], [])
      expect(content.wallQuantity.rows).toHaveLength(2)
    })
  })

  // B-2. 壁の配置バランス
  describe('wallBalance section', () => {
    it('returns eccentricity rows with judgment', () => {
      const content = buildDetailedReportContent(makeResult(), null, makeWalls(), [])
      expect(content.wallBalance.rows.length).toBe(4)
      for (const row of content.wallBalance.rows) {
        expect(row.judgmentJa).toBeTruthy()
      }
    })

    it('marks low eccentricity as 良好', () => {
      const content = buildDetailedReportContent(makeResult(), null, makeWalls(), [])
      const lowEcRow = content.wallBalance.rows.find((r) => r.eccentricityRatio <= 0.15)
      expect(lowEcRow?.judgmentJa).toContain('良好')
    })

    it('marks high eccentricity as 偏りが大きい', () => {
      const result = makeResult()
      result.directionalResults[0].eccentricityRatio = 0.4
      const content = buildDetailedReportContent(result, null, [], [])
      const highEcRow = content.wallBalance.rows.find((r) => r.eccentricityRatio === 0.4)
      expect(highEcRow?.judgmentJa).toContain('偏りが大きい')
    })
  })

  // B-3. 接合部の仕様
  describe('joints section', () => {
    it('summarizes joint specs from walls', () => {
      const content = buildDetailedReportContent(makeResult(), null, makeWalls(), [])
      expect(content.joints.totalCount).toBe(4)
      expect(content.joints.rows).toHaveLength(4)
    })

    it('calculates correct percentages', () => {
      const content = buildDetailedReportContent(makeResult(), null, makeWalls(), [])
      const hardwareComplete = content.joints.rows.find((r) => r.spec === 'hardware_complete')
      expect(hardwareComplete?.count).toBe(1)
      expect(hardwareComplete?.percentage).toBe(25)
    })

    it('handles empty walls', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], [])
      expect(content.joints.totalCount).toBe(0)
      for (const row of content.joints.rows) {
        expect(row.count).toBe(0)
        expect(row.percentage).toBe(0)
      }
    })
  })

  // B-4. 劣化度
  describe('deterioration section', () => {
    it('groups items by category', () => {
      const content = buildDetailedReportContent(makeResult(), null, makeWalls(), makeDeteriorationItems())
      // foundation, exterior_wall, roof, bathroom exist (balcony exists=false is excluded)
      expect(content.deterioration.categories.length).toBe(4)
    })

    it('counts checked items per category', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], makeDeteriorationItems())
      const foundation = content.deterioration.categories.find((c) => c.category === 'foundation')
      expect(foundation?.checkedCount).toBe(1)
      expect(foundation?.totalCount).toBe(2)
    })

    it('excludes non-existent categories', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], makeDeteriorationItems())
      const balcony = content.deterioration.categories.find((c) => c.category === 'balcony')
      expect(balcony).toBeUndefined()
    })

    it('includes dK and point totals', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], makeDeteriorationItems())
      expect(content.deterioration.dK).toBe(0.9)
      expect(content.deterioration.totalDeteriorationPoints).toBe(3)
      expect(content.deterioration.totalExistencePoints).toBe(30)
    })
  })

  // C. 補強計画
  describe('reinforcement section', () => {
    it('generates Plan A and Plan B when plan exists', () => {
      const content = buildDetailedReportContent(makeResult(), makePlan(), makeWalls(), [])
      expect(content.reinforcement.planA).not.toBeNull()
      expect(content.reinforcement.planB).not.toBeNull()
    })

    it('Plan A targets Iw 1.0', () => {
      const content = buildDetailedReportContent(makeResult(), makePlan(), makeWalls(), [])
      expect(content.reinforcement.planA?.targetIw).toBe(1.0)
    })

    it('Plan B targets Iw 1.5', () => {
      const content = buildDetailedReportContent(makeResult(), makePlan(), makeWalls(), [])
      expect(content.reinforcement.planB?.targetIw).toBe(1.5)
    })

    it('Plan A includes only high and medium priority suggestions', () => {
      const content = buildDetailedReportContent(makeResult(), makePlan(), makeWalls(), [])
      const priorities = content.reinforcement.planA?.suggestions.map((s) => s.priority)
      expect(priorities).not.toContain('low')
    })

    it('Plan B includes all suggestions', () => {
      const content = buildDetailedReportContent(makeResult(), makePlan(), makeWalls(), [])
      expect(content.reinforcement.planB?.suggestions.length).toBe(3)
    })

    it('returns null plans when reinforcementPlan is null', () => {
      const content = buildDetailedReportContent(makeResult(), null, makeWalls(), [])
      expect(content.reinforcement.planA).toBeNull()
      expect(content.reinforcement.planB).toBeNull()
    })
  })

  // D. 行政情報
  describe('administrative section', () => {
    it('includes hazard map note', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], [])
      expect(content.administrative.hazardMapNote).toContain('ハザードマップ')
    })

    it('includes subsidy template', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], [])
      expect(content.administrative.subsidyTemplateJa).toContain('補助金')
    })
  })

  // E. 免責事項
  describe('disclaimer section', () => {
    it('includes 6 disclaimer items', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], [])
      expect(content.disclaimer.items).toHaveLength(6)
    })

    it('includes references', () => {
      const content = buildDetailedReportContent(makeResult(), null, [], [])
      expect(content.disclaimer.references.length).toBeGreaterThanOrEqual(3)
    })
  })
})
