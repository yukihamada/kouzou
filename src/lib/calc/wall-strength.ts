import type { WallSegment, WallDirection } from '@/types/wall'
import { WALL_BASE_STRENGTH } from '@/lib/constants/wall-base-strength'
import { JOINT_REDUCTION_FACTORS } from '@/lib/constants/joint-specifications'

/**
 * 壁の耐力を計算する
 *
 * 1本の壁: Qw = Fw × L × Kj
 *   Fw = 壁基準耐力 (kN/m)
 *   L  = 壁の長さ (m)
 *   Kj = 接合部低減係数
 *
 * 裏面仕上げがある場合はその耐力も加算
 */
export function calculateSingleWallStrength(wall: WallSegment): number {
  if (wall.wallType === 'none') return 0

  const baseStrength = getBaseStrength(wall)
  const kj = JOINT_REDUCTION_FACTORS[wall.jointSpec]
  let strength = baseStrength * wall.length * kj

  // 裏面仕上げの耐力加算
  if (wall.backSurface && wall.backSurface !== 'none') {
    const backStrength =
      wall.backSurface === 'custom'
        ? 0
        : WALL_BASE_STRENGTH[wall.backSurface]
    strength += backStrength * wall.length * kj
  }

  return strength
}

function getBaseStrength(wall: WallSegment): number {
  if (wall.wallType === 'custom') {
    return wall.customBaseStrength ?? 0
  }
  if (wall.wallType === 'none') {
    return 0
  }
  return WALL_BASE_STRENGTH[wall.wallType]
}

/**
 * 指定した階・方向の保有耐力 Qu を計算する
 */
export function calculateWallStrengthSum(
  walls: WallSegment[],
  floor: 1 | 2,
  direction: WallDirection
): number {
  return walls
    .filter((w) => w.floor === floor && w.direction === direction)
    .reduce((sum, w) => sum + calculateSingleWallStrength(w), 0)
}

/**
 * 指定した階・方向の壁の合計長さを取得する
 */
export function calculateWallLengthSum(
  walls: WallSegment[],
  floor: 1 | 2,
  direction: WallDirection
): number {
  return walls
    .filter(
      (w) => w.floor === floor && w.direction === direction && w.wallType !== 'none'
    )
    .reduce((sum, w) => sum + w.length, 0)
}
