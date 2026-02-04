import type { BuildingInfo } from '@/types/building'
import { getRequiredCapacityCoefficient } from '@/lib/constants/required-capacity-coefficients'
import { GROUND_FACTORS } from '@/lib/constants/ground-factors'

/**
 * 必要耐力 Qr を計算する（略算法）
 *
 * Qr = C × A × Z × Sg
 *   C  = 必要耐力係数 (kN/m²)
 *   A  = 対象階の床面積 (m²)
 *   Z  = 地域係数
 *   Sg = 地盤割増係数
 */
export function calculateRequiredCapacity(
  targetFloor: 1 | 2 | 3,
  buildingInfo: BuildingInfo
): number {
  const { numberOfFloors, roofWeight, regionCoefficientZ, groundType, floorAreas } =
    buildingInfo

  const coefficient = getRequiredCapacityCoefficient(
    numberOfFloors,
    targetFloor,
    roofWeight
  )

  const area = getFloorArea(targetFloor, floorAreas)
  const groundFactor = GROUND_FACTORS[groundType]
  const z = regionCoefficientZ

  return coefficient * area * z * groundFactor
}

function getFloorArea(
  floor: 1 | 2 | 3,
  floorAreas: BuildingInfo['floorAreas']
): number {
  switch (floor) {
    case 1:
      return floorAreas.floor1
    case 2:
      return floorAreas.floor2 ?? 0
    case 3:
      return floorAreas.floor3 ?? 0
  }
}
