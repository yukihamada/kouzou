import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SimpleDiagnosisResult } from '@/types/simple-diagnosis'

interface SimpleDiagnosisStore {
  currentStep: number
  answers: Record<number, string>
  result: SimpleDiagnosisResult | null

  setAnswer: (questionId: number, optionId: string) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  setResult: (result: SimpleDiagnosisResult) => void
  reset: () => void
}

export const useSimpleDiagnosisStore = create<SimpleDiagnosisStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      answers: {},
      result: null,

      setAnswer: (questionId, optionId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionId },
        })),

      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 10) })),

      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

      goToStep: (step) => set({ currentStep: step }),

      setResult: (result) => set({ result }),

      reset: () => set({ currentStep: 0, answers: {}, result: null }),
    }),
    { name: 'simple-diagnosis' }
  )
)
