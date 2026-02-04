export interface SimpleQuestion {
  id: number
  questionJa: string
  helpTextJa?: string
  options: SimpleQuestionOption[]
}

export interface SimpleQuestionOption {
  id: string
  labelJa: string
  descriptionJa?: string
  score: number   // 1 or 0
}

export type SimpleRating = 'safe' | 'caution' | 'danger'

export interface SimpleDiagnosisResult {
  answers: Record<number, string>
  totalScore: number
  rating: SimpleRating
  recommendDetailedDiagnosis: boolean
  messageJa: string
}
