import type { SimpleDiagnosisResult, SimpleRating } from '@/types/simple-diagnosis'
import type {
  SimpleReportContent,
  SimpleOverallRating,
  SimpleBuildingData,
  FailedCheckItem,
  TrafficLightColor,
  RoadmapStep,
} from './types'
import { SIMPLE_DIAGNOSIS_QUESTIONS } from '@/lib/constants/simple-diagnosis-questions'
import {
  FAILED_CHECK_DESCRIPTIONS,
  QUESTION_LABELS,
  ROADMAP_DANGER,
  ROADMAP_CAUTION,
  ROADMAP_SAFE,
} from './constants'
import { generateEarthquakeComparison } from './earthquake-comparison'

function getRatingLabelJa(rating: SimpleRating): string {
  switch (rating) {
    case 'safe':
      return '一応安全'
    case 'caution':
      return '要注意'
    case 'danger':
      return '要診断'
  }
}

function getTrafficLightColor(rating: SimpleRating): TrafficLightColor {
  switch (rating) {
    case 'safe':
      return 'green'
    case 'caution':
      return 'yellow'
    case 'danger':
      return 'red'
  }
}

function getTrafficLightLabelJa(color: TrafficLightColor): string {
  switch (color) {
    case 'green':
      return '安全'
    case 'yellow':
      return '注意'
    case 'red':
      return '危険'
  }
}

/** ① 総合判定ランク */
function buildOverallRating(result: SimpleDiagnosisResult): SimpleOverallRating {
  const color = getTrafficLightColor(result.rating)
  return {
    score: result.totalScore,
    maxScore: 10,
    rating: result.rating,
    ratingLabelJa: getRatingLabelJa(result.rating),
    trafficLight: {
      color,
      labelJa: getTrafficLightLabelJa(color),
    },
  }
}

/** ② 建物基本データ（回答から抽出） */
function buildBuildingData(result: SimpleDiagnosisResult): SimpleBuildingData {
  const items: SimpleBuildingData['items'] = []
  const questions = SIMPLE_DIAGNOSIS_QUESTIONS

  for (const q of questions) {
    const answerId = result.answers[q.id]
    if (!answerId) continue

    const option = q.options.find((o) => o.id === answerId)
    if (!option) continue

    const label = QUESTION_LABELS[q.id] ?? `問${q.id}`
    const warning = option.score === 0

    items.push({
      labelJa: label,
      valueJa: option.labelJa,
      warning,
    })
  }

  return { items }
}

/** ③ 不合格チェック項目 */
function buildFailedChecks(result: SimpleDiagnosisResult): FailedCheckItem[] {
  const failedItems: FailedCheckItem[] = []
  const questions = SIMPLE_DIAGNOSIS_QUESTIONS

  for (const q of questions) {
    const answerId = result.answers[q.id]
    if (!answerId) continue

    const option = q.options.find((o) => o.id === answerId)
    if (!option || option.score !== 0) continue

    failedItems.push({
      questionNumber: q.id,
      questionJa: q.questionJa,
      riskDescriptionJa:
        FAILED_CHECK_DESCRIPTIONS[q.id] ?? '詳細はお問い合わせください。',
    })
  }

  return failedItems
}

/** ⑤ ロードマップ */
function buildRoadmap(rating: SimpleRating): RoadmapStep[] {
  switch (rating) {
    case 'danger':
      return ROADMAP_DANGER
    case 'caution':
      return ROADMAP_CAUTION
    case 'safe':
      return ROADMAP_SAFE
  }
}

/**
 * 簡易診断結果からレポートコンテンツを構造化データとして生成する
 */
export function buildSimpleReportContent(
  result: SimpleDiagnosisResult
): SimpleReportContent {
  return {
    overallRating: buildOverallRating(result),
    buildingData: buildBuildingData(result),
    failedChecks: buildFailedChecks(result),
    earthquakeComparison: generateEarthquakeComparison(result.rating),
    roadmap: buildRoadmap(result.rating),
  }
}
