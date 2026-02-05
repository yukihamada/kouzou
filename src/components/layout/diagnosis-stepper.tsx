'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  label: string
  href: string
}

interface DiagnosisStepperProps {
  steps: Step[]
  currentStep: number
}

export function DiagnosisStepper({ steps, currentStep }: DiagnosisStepperProps) {
  const getStepAriaLabel = (step: Step, index: number, isCompleted: boolean, isCurrent: boolean) => {
    const stepNumber = `ステップ${index + 1}: ${step.label}`
    if (isCompleted) {
      return `${stepNumber}、完了`
    }
    if (isCurrent) {
      return `${stepNumber}、現在のステップ`
    }
    return `${stepNumber}、未完了`
  }

  return (
    <nav className="mb-8" aria-label="診断ステップ">
      <ol className="flex items-center gap-2" role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li
              key={step.href}
              className="flex items-center gap-2"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={getStepAriaLabel(step, index, isCompleted, isCurrent)}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  isCompleted && 'bg-green-600 text-white',
                  isCurrent && 'bg-zinc-900 text-white',
                  !isCompleted && !isCurrent && 'bg-zinc-200 text-zinc-500'
                )}
                aria-hidden="true"
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  'text-sm hidden sm:inline',
                  isCurrent ? 'font-medium text-zinc-900' : 'text-zinc-500'
                )}
                aria-hidden="true"
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="h-px w-8 bg-zinc-300" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
