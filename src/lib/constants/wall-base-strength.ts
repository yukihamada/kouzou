import type { WallSpecificationType } from '@/types/wall'

/**
 * 壁基準耐力 (kN/m) — 2012年改訂版準拠
 * 在来工法用
 */
export const WALL_BASE_STRENGTH: Record<
  Exclude<WallSpecificationType, 'none' | 'custom'>,
  number
> = {
  // 筋交い
  brace_15x90_single: 1.96,   // 壁倍率1.0相当
  brace_30x90_single: 3.92,   // 壁倍率2.0相当
  brace_45x90_single: 5.88,   // 壁倍率3.0相当
  brace_30x90_cross: 7.84,    // 壁倍率4.0相当
  brace_45x90_cross: 9.80,    // 壁倍率5.0相当
  brace_90x90_single: 5.88,   // 壁倍率3.0相当
  brace_90x90_cross: 9.80,    // 壁倍率5.0相当

  // 構造用合板
  plywood_75_owari: 4.90,     // 壁倍率2.5相当
  plywood_9_owari: 5.88,      // 壁倍率3.0相当 (大臣認定なし)
  plywood_9_shinkabe: 3.43,   // 壁倍率1.75相当
  plywood_12_owari: 6.86,     // 壁倍率3.5相当

  // 石膏ボード
  gypsum_9: 1.37,             // 壁倍率0.7相当
  gypsum_12: 1.96,            // 壁倍率1.0相当

  // 土壁
  mud_wall_40: 2.94,          // 壁倍率1.5相当
  mud_wall_50: 3.92,          // 壁倍率2.0相当
  mud_wall_70: 4.90,          // 壁倍率2.5相当
}

/**
 * 壁倍率テーブル（参考表示用）
 */
export const WALL_MULTIPLIERS: Record<
  Exclude<WallSpecificationType, 'none' | 'custom'>,
  number
> = {
  brace_15x90_single: 1.0,
  brace_30x90_single: 2.0,
  brace_45x90_single: 3.0,
  brace_30x90_cross: 4.0,
  brace_45x90_cross: 5.0,
  brace_90x90_single: 3.0,
  brace_90x90_cross: 5.0,
  plywood_75_owari: 2.5,
  plywood_9_owari: 3.0,
  plywood_9_shinkabe: 1.75,
  plywood_12_owari: 3.5,
  gypsum_9: 0.7,
  gypsum_12: 1.0,
  mud_wall_40: 1.5,
  mud_wall_50: 2.0,
  mud_wall_70: 2.5,
}

/**
 * 壁仕様の日本語名称
 */
export const WALL_TYPE_LABELS: Record<WallSpecificationType, string> = {
  brace_15x90_single: '筋交い 1.5×9cm 片',
  brace_30x90_single: '筋交い 3.0×9cm 片',
  brace_45x90_single: '筋交い 4.5×9cm 片',
  brace_30x90_cross: '筋交い 3.0×9cm たすき',
  brace_45x90_cross: '筋交い 4.5×9cm たすき',
  brace_90x90_single: '筋交い 9.0×9cm 片',
  brace_90x90_cross: '筋交い 9.0×9cm たすき',
  plywood_75_owari: '構造用合板 7.5mm 大壁',
  plywood_9_owari: '構造用合板 9mm 大壁',
  plywood_9_shinkabe: '構造用合板 9mm 真壁',
  plywood_12_owari: '構造用合板 12mm 大壁',
  gypsum_9: '石膏ボード 9mm',
  gypsum_12: '石膏ボード 12mm',
  mud_wall_40: '土壁 40mm以上',
  mud_wall_50: '土壁 50mm以上',
  mud_wall_70: '土壁 70mm以上',
  none: '壁なし（開口部）',
  custom: 'カスタム入力',
}
