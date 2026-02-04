export type ReinforcementType =
  | 'add_shear_wall'         // 耐力壁の追加
  | 'add_brace'              // 筋交い補強
  | 'foundation_repair'      // 基礎補強
  | 'roof_lighten'           // 屋根軽量化
  | 'joint_hardware'         // 接合部金物補強
  | 'wall_panel'             // 耐震パネル設置
  | 'deterioration_repair'   // 劣化箇所修繕

export interface ReinforcementSuggestion {
  type: ReinforcementType
  labelJa: string
  descriptionJa: string
  priority: 'high' | 'medium' | 'low'
  estimatedCostMin: number  // 円
  estimatedCostMax: number  // 円
  estimatedIwImprovement: number
  unit: string              // 例: "1箇所", "1m"
  quantity: number
  reason: string
}

export interface ReinforcementPlan {
  suggestions: ReinforcementSuggestion[]
  totalCostMin: number
  totalCostMax: number
  currentIw: number
  estimatedIwAfter: number
}
