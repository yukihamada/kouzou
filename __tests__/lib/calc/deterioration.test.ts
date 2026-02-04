import { describe, it, expect } from 'vitest'
import { calculateDeteriorationFactor } from '@/lib/calc/deterioration'
import type { DeteriorationItem } from '@/types/deterioration'

function makeItem(
  id: string,
  points: number,
  checked: boolean,
  exists = true
): DeteriorationItem {
  return {
    id,
    category: 'foundation',
    labelJa: 'テスト項目',
    descriptionJa: '',
    points,
    checked,
    exists,
  }
}

describe('calculateDeteriorationFactor', () => {
  it('劣化なし → dK = 1.0', () => {
    const items = [
      makeItem('1', 3, false),
      makeItem('2', 2, false),
    ]
    const result = calculateDeteriorationFactor(items)
    expect(result.dK).toBe(1.0)
    expect(result.totalDeteriorationPoints).toBe(0)
    expect(result.totalExistencePoints).toBe(5)
  })

  it('半分劣化 → dK = 1 - 3/5 = 0.4 → min 0.7', () => {
    const items = [
      makeItem('1', 3, true),
      makeItem('2', 2, false),
    ]
    const result = calculateDeteriorationFactor(items)
    expect(result.dK).toBe(0.7) // 下限
    expect(result.totalDeteriorationPoints).toBe(3)
  })

  it('少量劣化 → dK = 1 - 2/10 = 0.8', () => {
    const items = [
      makeItem('1', 3, false),
      makeItem('2', 2, true),
      makeItem('3', 4, false),
      makeItem('4', 1, false),
    ]
    const result = calculateDeteriorationFactor(items)
    expect(result.dK).toBeCloseTo(0.8, 2)
  })

  it('存在しない部位は除外', () => {
    const items = [
      makeItem('1', 3, true, true),
      makeItem('2', 4, true, false), // 存在しない → 除外
    ]
    const result = calculateDeteriorationFactor(items)
    expect(result.totalExistencePoints).toBe(3)
    expect(result.totalDeteriorationPoints).toBe(3)
    expect(result.dK).toBe(0.7) // 1 - 3/3 = 0 → 0.7
  })

  it('項目なし → dK = 1.0', () => {
    const result = calculateDeteriorationFactor([])
    expect(result.dK).toBe(1.0)
  })
})
