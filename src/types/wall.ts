/** 壁の方向 */
export type WallDirection = 'X' | 'Y'

/** 壁仕様の種類 */
export type WallSpecificationType =
  // 筋交い
  | 'brace_15x90_single'      // 1.5cm×9cm 片筋交い
  | 'brace_30x90_single'      // 3.0cm×9cm 片筋交い
  | 'brace_45x90_single'      // 4.5cm×9cm 片筋交い
  | 'brace_30x90_cross'       // 3.0cm×9cm たすき掛け
  | 'brace_45x90_cross'       // 4.5cm×9cm たすき掛け
  | 'brace_90x90_single'      // 9.0cm×9cm 片筋交い
  | 'brace_90x90_cross'       // 9.0cm×9cm たすき掛け
  // 構造用合板
  | 'plywood_75_owari'        // 構造用合板 7.5mm 大壁
  | 'plywood_9_owari'         // 構造用合板 9mm 大壁
  | 'plywood_9_shinkabe'      // 構造用合板 9mm 真壁
  | 'plywood_12_owari'        // 構造用合板 12mm 大壁
  // 石膏ボード
  | 'gypsum_9'                // 石膏ボード 9mm
  | 'gypsum_12'               // 石膏ボード 12mm
  // 土壁
  | 'mud_wall_40'             // 土壁 40mm以上〜50mm未満
  | 'mud_wall_50'             // 土壁 50mm以上〜70mm未満
  | 'mud_wall_70'             // 土壁 70mm以上
  // その他
  | 'none'                    // 壁なし（開口部等）
  | 'custom'                  // カスタム入力

/** 接合部の仕様 */
export type JointSpecification =
  | 'hardware_complete'       // 金物あり（告示仕様）
  | 'hardware_partial'        // 金物一部あり
  | 'nailing_only'            // 釘打ちのみ
  | 'none'                    // 金物なし

/** 個別の壁データ */
export interface WallSegment {
  id: string
  floor: 1 | 2
  direction: WallDirection
  wallType: WallSpecificationType
  length: number              // 壁の長さ (m)
  height: number              // 壁の高さ (m), default 2.7
  jointSpec: JointSpecification
  positionX: number           // X座標 (mm) - 剛心計算用
  positionY: number           // Y座標 (mm) - 剛心計算用
  customBaseStrength?: number // カスタム壁基準耐力 (kN/m)
  backSurface?: WallSpecificationType
  note?: string
}

/** 階ごとの壁データ */
export interface FloorWalls {
  floor: 1 | 2
  walls: WallSegment[]
}
