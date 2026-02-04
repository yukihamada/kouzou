/** 構法種別 */
export type ConstructionMethod = 'conventional' | '2x4'

/** 屋根の重さ区分 */
export type RoofWeight = 'heavy' | 'moderate' | 'light'

/** 基礎の種類 */
export type FoundationType =
  | 'rebar_concrete_spread'   // 鉄筋コンクリート布基礎
  | 'unreinforced_concrete'   // 無筋コンクリート布基礎
  | 'rebar_concrete_mat'      // 鉄筋コンクリートべた基礎
  | 'stone'                   // 玉石基礎
  | 'other'

/** 地盤の種類 */
export type GroundType = 'good' | 'normal' | 'soft'

/** 平面形状 */
export interface FloorShape {
  width: number   // X方向 (mm)
  depth: number   // Y方向 (mm)
  isRegular: boolean
}

/** 建物基本情報 */
export interface BuildingInfo {
  constructionMethod: ConstructionMethod
  buildYear: number
  numberOfFloors: 1 | 2 | 3
  roofWeight: RoofWeight
  foundationType: FoundationType
  groundType: GroundType
  regionCoefficientZ: number   // 地域係数 Z (0.7〜1.0)
  snowDepthM: number           // 積雪深 (m)

  floorAreas: {
    floor1: number   // m²
    floor2?: number
    floor3?: number
  }

  floorShapes: {
    floor1: FloorShape
    floor2?: FloorShape
  }

  address?: string
  ownerName?: string
  diagnosisDate: string
}
