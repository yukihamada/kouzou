import type { DeteriorationItem, DeteriorationResult } from '@/types/deterioration'

/**
 * 劣化低減係数 dK を計算する
 *
 * dK = 1 - (劣化点数合計 / 存在点数合計)
 * ただし最低 0.7（それ以下にはしない）
 */
export function calculateDeteriorationFactor(
  items: DeteriorationItem[]
): DeteriorationResult {
  // 存在する部位のみ対象
  const existingItems = items.filter((item) => item.exists)

  const totalExistencePoints = existingItems.reduce(
    (sum, item) => sum + item.points,
    0
  )

  const totalDeteriorationPoints = existingItems
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.points, 0)

  let dK: number
  if (totalExistencePoints === 0) {
    dK = 1.0
  } else {
    dK = 1 - totalDeteriorationPoints / totalExistencePoints
    dK = Math.max(0.7, dK)
  }

  return {
    items,
    totalDeteriorationPoints,
    totalExistencePoints,
    dK,
  }
}
