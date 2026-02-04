/** 劣化調査の部位 */
export type DeteriorationCategory =
  | 'foundation'        // 基礎
  | 'exterior_wall'     // 外壁
  | 'roof'              // 屋根
  | 'living_room'       // 居室・廊下
  | 'bathroom'          // 浴室
  | 'balcony'           // バルコニー
  | 'gutter'            // 雨樋
  | 'attic'             // 小屋裏
  | 'under_floor'       // 床下

export interface DeteriorationItem {
  id: string
  category: DeteriorationCategory
  labelJa: string
  descriptionJa: string
  points: number          // 劣化点数
  checked: boolean        // チェックされたか
  exists: boolean         // この部位が建物に存在するか
}

export interface DeteriorationResult {
  items: DeteriorationItem[]
  totalDeteriorationPoints: number
  totalExistencePoints: number
  dK: number              // 低減係数 (0.7〜1.0)
}
