import type { RoofWeight } from '@/types/building'

/**
 * 必要耐力係数 (kN/m²)
 * 2012年改訂版 略算法用
 *
 * [階数][対象階][屋根重量] → 係数
 */
export interface RequiredCapacityKey {
  totalFloors: 1 | 2 | 3
  targetFloor: 1 | 2 | 3
  roofWeight: RoofWeight
}

type CoefficientsTable = Record<string, number>

function makeKey(totalFloors: number, targetFloor: number, roofWeight: RoofWeight): string {
  return `${totalFloors}-${targetFloor}-${roofWeight}`
}

const COEFFICIENTS: CoefficientsTable = {
  // 平屋
  [makeKey(1, 1, 'heavy')]: 0.53,
  [makeKey(1, 1, 'moderate')]: 0.46,
  [makeKey(1, 1, 'light')]: 0.40,

  // 2階建て - 2階
  [makeKey(2, 2, 'heavy')]: 0.54,
  [makeKey(2, 2, 'moderate')]: 0.46,
  [makeKey(2, 2, 'light')]: 0.40,

  // 2階建て - 1階
  [makeKey(2, 1, 'heavy')]: 0.83,
  [makeKey(2, 1, 'moderate')]: 0.72,
  [makeKey(2, 1, 'light')]: 0.64,

  // 3階建て - 3階
  [makeKey(3, 3, 'heavy')]: 0.54,
  [makeKey(3, 3, 'moderate')]: 0.46,
  [makeKey(3, 3, 'light')]: 0.40,

  // 3階建て - 2階
  [makeKey(3, 2, 'heavy')]: 0.83,
  [makeKey(3, 2, 'moderate')]: 0.72,
  [makeKey(3, 2, 'light')]: 0.64,

  // 3階建て - 1階
  [makeKey(3, 1, 'heavy')]: 1.06,
  [makeKey(3, 1, 'moderate')]: 0.92,
  [makeKey(3, 1, 'light')]: 0.82,
}

/**
 * 必要耐力係数を取得
 */
export function getRequiredCapacityCoefficient(
  totalFloors: 1 | 2 | 3,
  targetFloor: 1 | 2 | 3,
  roofWeight: RoofWeight
): number {
  const key = makeKey(totalFloors, targetFloor, roofWeight)
  const coeff = COEFFICIENTS[key]
  if (coeff === undefined) {
    throw new Error(
      `必要耐力係数が見つかりません: ${totalFloors}階建ての${targetFloor}階, 屋根=${roofWeight}`
    )
  }
  return coeff
}
