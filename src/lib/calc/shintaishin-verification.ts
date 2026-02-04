import type {
  ShintaishinCheck,
  ShintaishinEligibility,
  ShintaishinResult,
  ShintaishinVerdict,
  ShintaishinDeteriorationCheck,
} from '@/types/shintaishin-verification'

/**
 * 新耐震木造住宅検証法の対象チェック
 */
export function checkEligibility(
  buildYear: number,
  constructionMethod: 'conventional' | '2x4',
  foundationType: string,
  numberOfFloors: number
): ShintaishinEligibility {
  // 昭和56年6月(1981) 〜 平成12年5月(2000)
  const isInPeriod = buildYear >= 1981 && buildYear <= 2000
  const isConventionalWithConcrete =
    constructionMethod === 'conventional' &&
    (foundationType === 'rebar_concrete_spread' ||
      foundationType === 'rebar_concrete_mat' ||
      foundationType === 'unreinforced_concrete')
  const isValidStructure = numberOfFloors <= 2

  return {
    isInPeriod,
    isConventionalWithConcrete,
    isValidStructure,
    isEligible: isInPeriod && isConventionalWithConcrete && isValidStructure,
  }
}

/**
 * 劣化チェックの合計点を計算
 */
export function calculateDeteriorationTotal(
  det: ShintaishinDeteriorationCheck
): number {
  return det.exteriorWall + det.roof + det.foundation + det.floor + det.bathroom
}

/**
 * 所有者等による検証の判定
 *
 * チェック1〜3がすべて「はい」かつチェック4で4点以上 → 一応倒壊しない
 * それ以外 → 専門家による検証が必要
 */
export function evaluateShintaishin(
  checks: ShintaishinCheck
): ShintaishinResult {
  const deteriorationTotal = calculateDeteriorationTotal(
    checks.check4Deterioration
  )

  const allChecks123Pass =
    checks.check1Shape === true &&
    checks.check2JointHardware === true &&
    checks.check3WallRatio === true

  let verdict: ShintaishinVerdict
  let verdictJa: string

  if (allChecks123Pass && deteriorationTotal >= 4) {
    verdict = 'safe'
    verdictJa = '一応倒壊しない'
  } else {
    verdict = 'expert_needed'
    verdictJa = '専門家による検証が必要'
  }

  return {
    eligibility: {
      isInPeriod: true,
      isConventionalWithConcrete: true,
      isValidStructure: true,
      isEligible: true,
    },
    checks,
    deteriorationTotal,
    verdict,
    verdictJa,
  }
}
