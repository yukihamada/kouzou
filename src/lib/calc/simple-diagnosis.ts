import type {
  SimpleDiagnosisResult,
  SimpleRating,
} from '@/types/simple-diagnosis'
import { SIMPLE_DIAGNOSIS_QUESTIONS } from '@/lib/constants/simple-diagnosis-questions'

/**
 * 簡易診断のスコアを計算する
 * 各問の選択肢スコア(0 or 1)を合計して10点満点で評価
 *
 * 判定基準:
 * - 10点: 一応安全 → 念のため専門家に
 * - 8〜9点: 注意 → 専門家にみてもらいましょう
 * - 7点以下: 危険 → 早めに専門家にみてもらいましょう
 */
export function calculateSimpleDiagnosis(
  answers: Record<number, string>
): SimpleDiagnosisResult {
  let totalScore = 0

  for (const question of SIMPLE_DIAGNOSIS_QUESTIONS) {
    const selectedOptionId = answers[question.id]
    if (!selectedOptionId) continue

    const option = question.options.find((o) => o.id === selectedOptionId)
    if (option) {
      totalScore += option.score
    }
  }

  const { rating, messageJa } = evaluateScore(totalScore)
  const recommendDetailedDiagnosis = totalScore < 10

  return {
    answers,
    totalScore,
    rating,
    recommendDetailedDiagnosis,
    messageJa,
  }
}

function evaluateScore(score: number): {
  rating: SimpleRating
  messageJa: string
} {
  if (score >= 10) {
    return {
      rating: 'safe',
      messageJa:
        'ひとまず安心ですが、念のため専門家に診てもらいましょう。',
    }
  }
  if (score >= 8) {
    return {
      rating: 'caution',
      messageJa:
        '少し心配な点があります。専門家に診てもらいましょう。',
    }
  }
  return {
    rating: 'danger',
    messageJa:
      '心配な点が多いです。できるだけ早く専門家に診てもらいましょう。',
  }
}
