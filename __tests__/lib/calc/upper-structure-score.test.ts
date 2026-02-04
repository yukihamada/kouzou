import { describe, it, expect } from 'vitest'
import {
  calculateDetailedDiagnosis,
  getStructuralRating,
} from '@/lib/calc/upper-structure-score'
import type { BuildingInfo } from '@/types/building'
import type { WallSegment } from '@/types/wall'

const sampleBuilding: BuildingInfo = {
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
    floor1: { width: 10000, depth: 6000, isRegular: true },
    floor2: { width: 10000, depth: 5000, isRegular: true },
  },
  diagnosisDate: '2024-01-01',
}

function makeWall(
  id: string,
  floor: 1 | 2,
  direction: 'X' | 'Y',
  length: number,
  posX: number,
  posY: number
): WallSegment {
  return {
    id,
    floor,
    direction,
    wallType: 'brace_45x90_single', // 5.88 kN/m
    length,
    height: 2.7,
    jointSpec: 'hardware_complete',
    positionX: posX,
    positionY: posY,
  }
}

describe('getStructuralRating', () => {
  it('Iw >= 1.5 → safe', () => {
    expect(getStructuralRating(1.5)).toBe('safe')
    expect(getStructuralRating(2.0)).toBe('safe')
  })
  it('1.0 <= Iw < 1.5 → generally_safe', () => {
    expect(getStructuralRating(1.0)).toBe('generally_safe')
    expect(getStructuralRating(1.49)).toBe('generally_safe')
  })
  it('0.7 <= Iw < 1.0 → somewhat_danger', () => {
    expect(getStructuralRating(0.7)).toBe('somewhat_danger')
    expect(getStructuralRating(0.99)).toBe('somewhat_danger')
  })
  it('Iw < 0.7 → collapse_risk', () => {
    expect(getStructuralRating(0.69)).toBe('collapse_risk')
    expect(getStructuralRating(0.0)).toBe('collapse_risk')
  })
})

describe('calculateDetailedDiagnosis', () => {
  it('十分な壁量でIw >= 1.0', () => {
    // 1階X方向のQr = 0.83 × 60 = 49.8 kN
    // 壁10m × 5.88 = 58.8 kN → Iw ≈ 1.18 (偏心・劣化なし)
    const walls: WallSegment[] = [
      // 1F X方向 10m分
      makeWall('1x1', 1, 'X', 5, 0, 3000),
      makeWall('1x2', 1, 'X', 5, 10000, 3000),
      // 1F Y方向 10m分
      makeWall('1y1', 1, 'Y', 5, 5000, 0),
      makeWall('1y2', 1, 'Y', 5, 5000, 6000),
      // 2F X方向 6m分
      makeWall('2x1', 2, 'X', 3, 0, 2500),
      makeWall('2x2', 2, 'X', 3, 10000, 2500),
      // 2F Y方向 6m分
      makeWall('2y1', 2, 'Y', 3, 5000, 0),
      makeWall('2y2', 2, 'Y', 3, 5000, 5000),
    ]

    const result = calculateDetailedDiagnosis(sampleBuilding, walls, [])

    expect(result.directionalResults).toHaveLength(4) // 2階 × 2方向
    expect(result.overallIw).toBeGreaterThan(0)

    // 各方向の結果が存在する
    const f1x = result.directionalResults.find(
      (r) => r.floor === 1 && r.direction === 'X'
    )
    expect(f1x).toBeDefined()
    expect(f1x!.qu).toBeGreaterThan(0)
    expect(f1x!.qr).toBeGreaterThan(0)
  })

  it('壁量がゼロだとIw = 0', () => {
    const result = calculateDetailedDiagnosis(sampleBuilding, [], [])
    expect(result.overallIw).toBe(0)
    expect(result.overallRating).toBe('collapse_risk')
  })

  it('平屋の場合は2方向のみ', () => {
    const hiraya: BuildingInfo = {
      ...sampleBuilding,
      numberOfFloors: 1,
      floorAreas: { floor1: 80 },
      floorShapes: {
        floor1: { width: 10000, depth: 8000, isRegular: true },
      },
    }
    const walls = [
      makeWall('1', 1, 'X', 5, 5000, 0),
      makeWall('2', 1, 'Y', 5, 0, 4000),
    ]
    const result = calculateDetailedDiagnosis(hiraya, walls, [])
    expect(result.directionalResults).toHaveLength(2)
  })

  it('劣化がある場合にIwが低下する', () => {
    const walls = [
      makeWall('1', 1, 'X', 10, 5000, 3000),
      makeWall('2', 1, 'Y', 10, 5000, 3000),
      makeWall('3', 2, 'X', 6, 5000, 2500),
      makeWall('4', 2, 'Y', 6, 5000, 2500),
    ]

    const noDet = calculateDetailedDiagnosis(sampleBuilding, walls, [])

    const detItems = [
      {
        id: 'f1',
        category: 'foundation' as const,
        labelJa: '',
        descriptionJa: '',
        points: 3,
        checked: true,
        exists: true,
      },
      {
        id: 'f2',
        category: 'under_floor' as const,
        labelJa: '',
        descriptionJa: '',
        points: 7,
        checked: false,
        exists: true,
      },
    ]
    const withDet = calculateDetailedDiagnosis(sampleBuilding, walls, detItems)

    expect(withDet.overallIw).toBeLessThan(noDet.overallIw)
    expect(withDet.deteriorationScore.dK).toBeLessThan(1.0)
  })
})
