'use client'

import { useSimpleDiagnosisStore } from '@/stores/simple-diagnosis-store'
import { SIMPLE_DIAGNOSIS_QUESTIONS } from '@/lib/constants/simple-diagnosis-questions'
import { calculateSimpleDiagnosis } from '@/lib/calc/simple-diagnosis'
import { QuestionCard } from '@/components/diagnosis/simple/question-card'
import { SimpleResultDisplay } from '@/components/diagnosis/simple/simple-result-display'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SimpleDiagnosisPage() {
  const {
    currentStep,
    answers,
    result,
    setAnswer,
    nextStep,
    prevStep,
    setResult,
    reset,
  } = useSimpleDiagnosisStore()

  const totalQuestions = SIMPLE_DIAGNOSIS_QUESTIONS.length
  const isLastQuestion = currentStep >= totalQuestions
  const progress = isLastQuestion
    ? 100
    : (currentStep / totalQuestions) * 100

  const handleFinish = () => {
    const diagnosisResult = calculateSimpleDiagnosis(answers)
    setResult(diagnosisResult)
    nextStep()
  }

  // 結果表示
  if (result && isLastQuestion) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <SimpleResultDisplay
          result={result}
          onReset={reset}
        />
      </div>
    )
  }

  const question = SIMPLE_DIAGNOSIS_QUESTIONS[currentStep]
  if (!question) return null

  const currentAnswer = answers[question.id]
  const isAnswered = !!currentAnswer

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-zinc-500 mb-2">
          <span>簡易耐震診断</span>
          <span>
            {currentStep + 1} / {totalQuestions}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <QuestionCard
        question={question}
        selectedOptionId={currentAnswer}
        onSelect={(optionId) => setAnswer(question.id, optionId)}
      />

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          前の問題
        </Button>

        {currentStep === totalQuestions - 1 ? (
          <Button onClick={handleFinish} disabled={!isAnswered}>
            診断結果を見る
          </Button>
        ) : (
          <Button onClick={nextStep} disabled={!isAnswered}>
            次の問題
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}
