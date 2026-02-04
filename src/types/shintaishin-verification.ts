/**
 * 新耐震木造住宅検証法（所有者等による検証）
 * 昭和56年6月〜平成12年5月に建築された木造住宅対象
 */

export interface ShintaishinEligibility {
  /** 昭和56年6月〜平成12年5月の間に建てられた木造住宅か */
  isInPeriod: boolean
  /** 在来軸組構法で基礎がコンクリート造か */
  isConventionalWithConcrete: boolean
  /** 平屋建てまたは2階建てで全階が木造か */
  isValidStructure: boolean
  /** 対象になるか */
  isEligible: boolean
}

export interface ShintaishinCheck {
  /** チェック1: 平面・立面形状が整形か */
  check1Shape: boolean | null
  /** チェック2: 柱とはりの接合部に接合金物が使われているか */
  check2JointHardware: boolean | null
  /** チェック3: 1階の外壁面(4面)で開口のない壁の長さの割合が0.3以上か */
  check3WallRatio: boolean | null
  /** チェック4: 劣化のチェック（5項目の合計点） */
  check4Deterioration: ShintaishinDeteriorationCheck
}

export interface ShintaishinDeteriorationCheck {
  /** イ. 外壁は健全か (0 or 1) */
  exteriorWall: number
  /** ロ. 屋根は健全か (0 or 1) */
  roof: number
  /** ハ. 基礎は健全か (0 or 1) */
  foundation: number
  /** ニ. 居室や廊下の床は健全か (0 or 1) */
  floor: number
  /** ホ. 浴室周りの作り (0 or 1) */
  bathroom: number
}

export type ShintaishinVerdict =
  | 'safe'            // 一応倒壊しない
  | 'expert_needed'   // 専門家による検証が必要

export interface ShintaishinResult {
  eligibility: ShintaishinEligibility
  checks: ShintaishinCheck
  deteriorationTotal: number
  verdict: ShintaishinVerdict
  verdictJa: string
}
