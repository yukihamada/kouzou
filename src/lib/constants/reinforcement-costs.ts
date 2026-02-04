import type { ReinforcementType } from '@/types/reinforcement'

interface CostReference {
  labelJa: string
  descriptionJa: string
  unit: string
  costMin: number // 円/unit
  costMax: number // 円/unit
  iwImprovementPerUnit: number // 1ユニットあたりのIw改善見込み
}

/**
 * 補強工法別の費用参考データ
 */
export const REINFORCEMENT_COST_REFERENCE: Record<
  ReinforcementType,
  CostReference
> = {
  add_shear_wall: {
    labelJa: '耐力壁の追加',
    descriptionJa: '新たに耐力壁を設置して壁量を増やす',
    unit: '箇所',
    costMin: 150000,
    costMax: 350000,
    iwImprovementPerUnit: 0.1,
  },
  add_brace: {
    labelJa: '筋交い補強',
    descriptionJa: '既存壁に筋交いを追加して耐力を向上',
    unit: '箇所',
    costMin: 50000,
    costMax: 200000,
    iwImprovementPerUnit: 0.08,
  },
  foundation_repair: {
    labelJa: '基礎補強',
    descriptionJa: '基礎のひび割れ補修や増し打ち',
    unit: '箇所',
    costMin: 200000,
    costMax: 500000,
    iwImprovementPerUnit: 0.05,
  },
  roof_lighten: {
    labelJa: '屋根軽量化',
    descriptionJa: '重い屋根材を軽い屋根材に交換',
    unit: '棟',
    costMin: 800000,
    costMax: 1500000,
    iwImprovementPerUnit: 0.15,
  },
  joint_hardware: {
    labelJa: '接合部金物補強',
    descriptionJa: '柱脚・柱頭の接合金物を設置',
    unit: '箇所',
    costMin: 20000,
    costMax: 50000,
    iwImprovementPerUnit: 0.03,
  },
  wall_panel: {
    labelJa: '耐震パネル設置',
    descriptionJa: '面材パネルによる耐震補強',
    unit: '箇所',
    costMin: 250000,
    costMax: 650000,
    iwImprovementPerUnit: 0.12,
  },
  deterioration_repair: {
    labelJa: '劣化箇所修繕',
    descriptionJa: '腐食・シロアリ被害箇所の修繕',
    unit: '箇所',
    costMin: 100000,
    costMax: 300000,
    iwImprovementPerUnit: 0.05,
  },
}
