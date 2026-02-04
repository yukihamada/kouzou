import { describe, it, expect } from 'vitest'
import {
  calculateSingleWallStrength,
  calculateWallStrengthSum,
  calculateWallLengthSum,
} from '@/lib/calc/wall-strength'
import type { WallSegment } from '@/types/wall'

function makeWall(overrides: Partial<WallSegment> = {}): WallSegment {
  return {
    id: '1',
    floor: 1,
    direction: 'X',
    wallType: 'brace_45x90_single',
    length: 1.0,
    height: 2.7,
    jointSpec: 'hardware_complete',
    positionX: 0,
    positionY: 0,
    ...overrides,
  }
}

describe('calculateSingleWallStrength', () => {
  it('4.5×9cm片筋交い 1m 金物完全: 5.88 × 1.0 × 1.0 = 5.88', () => {
    const wall = makeWall()
    expect(calculateSingleWallStrength(wall)).toBeCloseTo(5.88, 2)
  })

  it('壁長さ2mなら2倍', () => {
    const wall = makeWall({ length: 2.0 })
    expect(calculateSingleWallStrength(wall)).toBeCloseTo(11.76, 2)
  })

  it('釘打ちのみで0.7倍', () => {
    const wall = makeWall({ jointSpec: 'nailing_only' })
    expect(calculateSingleWallStrength(wall)).toBeCloseTo(5.88 * 0.7, 2)
  })

  it('金物なしで0.5倍', () => {
    const wall = makeWall({ jointSpec: 'none' })
    expect(calculateSingleWallStrength(wall)).toBeCloseTo(5.88 * 0.5, 2)
  })

  it('壁なしは0', () => {
    const wall = makeWall({ wallType: 'none' })
    expect(calculateSingleWallStrength(wall)).toBe(0)
  })

  it('カスタム壁基準耐力', () => {
    const wall = makeWall({
      wallType: 'custom',
      customBaseStrength: 7.0,
      length: 1.5,
    })
    expect(calculateSingleWallStrength(wall)).toBeCloseTo(7.0 * 1.5, 2)
  })

  it('裏面仕上げの耐力加算', () => {
    const wall = makeWall({
      wallType: 'brace_45x90_single',
      backSurface: 'gypsum_12',
      length: 1.0,
    })
    // 5.88 + 1.96 = 7.84
    expect(calculateSingleWallStrength(wall)).toBeCloseTo(7.84, 2)
  })
})

describe('calculateWallStrengthSum', () => {
  it('同じ階・方向の壁を合計する', () => {
    const walls = [
      makeWall({ id: '1', floor: 1, direction: 'X', length: 1.0 }),
      makeWall({ id: '2', floor: 1, direction: 'X', length: 2.0 }),
      makeWall({ id: '3', floor: 1, direction: 'Y', length: 1.0 }),
    ]
    const sum = calculateWallStrengthSum(walls, 1, 'X')
    expect(sum).toBeCloseTo(5.88 * 3, 1) // 1m + 2m = 3m分
  })

  it('異なる階の壁は含まれない', () => {
    const walls = [
      makeWall({ id: '1', floor: 1, direction: 'X' }),
      makeWall({ id: '2', floor: 2, direction: 'X' }),
    ]
    expect(calculateWallStrengthSum(walls, 1, 'X')).toBeCloseTo(5.88, 2)
  })
})

describe('calculateWallLengthSum', () => {
  it('壁の合計長さを計算する', () => {
    const walls = [
      makeWall({ id: '1', floor: 1, direction: 'X', length: 1.0 }),
      makeWall({ id: '2', floor: 1, direction: 'X', length: 2.5 }),
      makeWall({ id: '3', floor: 1, direction: 'X', length: 0.9, wallType: 'none' }),
    ]
    expect(calculateWallLengthSum(walls, 1, 'X')).toBeCloseTo(3.5, 1)
  })
})
