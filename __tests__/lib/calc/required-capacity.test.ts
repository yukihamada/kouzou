import { describe, it, expect } from 'vitest'
import { calculateRequiredCapacity } from '@/lib/calc/required-capacity'
import type { BuildingInfo } from '@/types/building'

const baseBuildingInfo: BuildingInfo = {
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

describe('calculateRequiredCapacity', () => {
  it('2階建て・1階・重い屋根: Qr = 0.83 × 60 × 1.0 × 1.0 = 49.8', () => {
    const qr = calculateRequiredCapacity(1, baseBuildingInfo)
    expect(qr).toBeCloseTo(49.8, 1)
  })

  it('2階建て・2階・重い屋根: Qr = 0.54 × 50 × 1.0 × 1.0 = 27.0', () => {
    const qr = calculateRequiredCapacity(2, baseBuildingInfo)
    expect(qr).toBeCloseTo(27.0, 1)
  })

  it('軟弱地盤で1.5倍になる', () => {
    const soft: BuildingInfo = { ...baseBuildingInfo, groundType: 'soft' }
    const qr = calculateRequiredCapacity(1, soft)
    expect(qr).toBeCloseTo(49.8 * 1.5, 1)
  })

  it('地域係数0.8で減少する', () => {
    const info: BuildingInfo = { ...baseBuildingInfo, regionCoefficientZ: 0.8 }
    const qr = calculateRequiredCapacity(1, info)
    expect(qr).toBeCloseTo(49.8 * 0.8, 1)
  })

  it('平屋・軽い屋根', () => {
    const info: BuildingInfo = {
      ...baseBuildingInfo,
      numberOfFloors: 1,
      roofWeight: 'light',
      floorAreas: { floor1: 80 },
      floorShapes: {
        floor1: { width: 10000, depth: 8000, isRegular: true },
      },
    }
    const qr = calculateRequiredCapacity(1, info)
    expect(qr).toBeCloseTo(0.40 * 80, 1) // 32.0
  })
})
