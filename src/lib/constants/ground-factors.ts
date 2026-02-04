import type { GroundType } from '@/types/building'

/**
 * 地盤による割増係数
 * 軟弱地盤の場合は必要耐力を1.5倍に割増す
 */
export const GROUND_FACTORS: Record<GroundType, number> = {
  good: 1.0,
  normal: 1.0,
  soft: 1.5,
}
