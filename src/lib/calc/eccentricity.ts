import type { WallSegment, WallDirection } from '@/types/wall'
import type { FloorShape } from '@/types/building'
import { calculateSingleWallStrength } from './wall-strength'

export interface EccentricityResult {
  /** 偏心率 Re */
  ratio: number
  /** 偏心率による低減係数 eKfl */
  correctionFactor: number
  /** 重心座標 (mm) */
  centerOfGravity: number
  /** 剛心座標 (mm) */
  centerOfRigidity: number
}

/**
 * 偏心率を計算する
 *
 * X方向の偏心率:
 *   Y方向壁の配置バランスを評価（Y方向壁のX方向での分布）
 *
 * Y方向の偏心率:
 *   X方向壁の配置バランスを評価（X方向壁のY方向での分布）
 */
export function calculateEccentricity(
  walls: WallSegment[],
  floorShape: FloorShape,
  floor: 1 | 2,
  evaluationDirection: WallDirection
): EccentricityResult {
  // evaluationDirection='X' → X方向の偏心率 → Y方向壁の分布で評価
  const wallDirection: WallDirection = evaluationDirection === 'X' ? 'Y' : 'X'
  const floorDimension =
    evaluationDirection === 'X' ? floorShape.width : floorShape.depth

  const relevantWalls = walls.filter(
    (w) => w.floor === floor && w.direction === wallDirection && w.wallType !== 'none'
  )

  if (relevantWalls.length === 0) {
    return {
      ratio: 1.0,
      correctionFactor: 0.5,
      centerOfGravity: floorDimension / 2,
      centerOfRigidity: 0,
    }
  }

  // 重心: 平面形状の幾何学的中心
  const centerOfGravity = floorDimension / 2

  // 各壁の剛性(耐力)と位置
  const wallData = relevantWalls.map((w) => {
    const strength = calculateSingleWallStrength(w)
    const position =
      evaluationDirection === 'X' ? w.positionX : w.positionY
    return { strength, position }
  })

  const totalStrength = wallData.reduce((s, w) => s + w.strength, 0)
  if (totalStrength === 0) {
    return {
      ratio: 1.0,
      correctionFactor: 0.5,
      centerOfGravity,
      centerOfRigidity: 0,
    }
  }

  // 剛心: 壁耐力の重心位置
  const centerOfRigidity =
    wallData.reduce((s, w) => s + w.strength * w.position, 0) / totalStrength

  // 偏心距離
  const eccentricityDistance = Math.abs(centerOfGravity - centerOfRigidity)

  // ねじり剛性
  const torsionalRigidity = wallData.reduce(
    (s, w) => s + w.strength * Math.pow(w.position - centerOfRigidity, 2),
    0
  )

  // 弾力半径
  const elasticRadius = Math.sqrt(torsionalRigidity / totalStrength)

  // 偏心率
  const ratio = elasticRadius > 0 ? eccentricityDistance / elasticRadius : 1.0

  // 低減係数
  const correctionFactor = getEccentricityCorrectionFactor(ratio)

  return {
    ratio,
    correctionFactor,
    centerOfGravity,
    centerOfRigidity,
  }
}

/**
 * 4分割法による壁量バランスチェック（簡易版）
 *
 * 建物の各辺から1/4の範囲内にある壁量が、
 * その方向の全壁量の一定割合以上あるかをチェック
 *
 * 返り値: 充足率（0.0〜1.0+）、1.0以上で合格
 */
export function calculateQuarterDivisionRatio(
  walls: WallSegment[],
  floorShape: FloorShape,
  floor: 1 | 2,
  direction: WallDirection
): number {
  const wallDirection: WallDirection = direction === 'X' ? 'Y' : 'X'
  const floorDimension = direction === 'X' ? floorShape.width : floorShape.depth
  const quarterLine = floorDimension / 4

  const relevantWalls = walls.filter(
    (w) => w.floor === floor && w.direction === wallDirection && w.wallType !== 'none'
  )

  if (relevantWalls.length === 0) return 0

  // 端部側の壁量
  const sidePosition = direction === 'X' ? 'positionX' : 'positionY'

  const side1Strength = relevantWalls
    .filter((w) => w[sidePosition] <= quarterLine)
    .reduce((s, w) => s + calculateSingleWallStrength(w), 0)

  const side2Strength = relevantWalls
    .filter((w) => w[sidePosition] >= floorDimension - quarterLine)
    .reduce((s, w) => s + calculateSingleWallStrength(w), 0)

  const minSideStrength = Math.min(side1Strength, side2Strength)
  const maxSideStrength = Math.max(side1Strength, side2Strength)

  if (maxSideStrength === 0) return 0

  // 壁率比 = 少ない側 / 多い側
  return minSideStrength / maxSideStrength
}

/**
 * 偏心率 Re に対する低減係数 eKfl
 */
function getEccentricityCorrectionFactor(re: number): number {
  if (re <= 0.15) return 1.0
  if (re <= 0.45) {
    // 線形補間: 0.15→1.0, 0.45→0.5
    return 1.0 - ((re - 0.15) / 0.30) * 0.5
  }
  return 0.5
}
