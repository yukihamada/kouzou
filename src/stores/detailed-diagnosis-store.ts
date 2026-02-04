import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BuildingInfo } from '@/types/building'
import type { WallSegment } from '@/types/wall'
import type { DeteriorationItem } from '@/types/deterioration'
import type { DetailedDiagnosisResult } from '@/types/diagnosis'
import type { ReinforcementPlan } from '@/types/reinforcement'

interface DetailedDiagnosisStore {
  currentStep: number
  buildingInfo: Partial<BuildingInfo>
  walls: WallSegment[]
  deteriorationItems: DeteriorationItem[]
  result: DetailedDiagnosisResult | null
  reinforcementPlan: ReinforcementPlan | null

  setBuildingInfo: (info: Partial<BuildingInfo>) => void
  addWall: (wall: WallSegment) => void
  updateWall: (id: string, updates: Partial<WallSegment>) => void
  removeWall: (id: string) => void
  setWalls: (walls: WallSegment[]) => void
  setDeteriorationItems: (items: DeteriorationItem[]) => void
  toggleDeteriorationItem: (id: string) => void
  setResult: (result: DetailedDiagnosisResult) => void
  setReinforcementPlan: (plan: ReinforcementPlan) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void
}

export const useDetailedDiagnosisStore = create<DetailedDiagnosisStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      buildingInfo: {},
      walls: [],
      deteriorationItems: [],
      result: null,
      reinforcementPlan: null,

      setBuildingInfo: (info) =>
        set((state) => ({
          buildingInfo: { ...state.buildingInfo, ...info },
        })),

      addWall: (wall) =>
        set((state) => ({ walls: [...state.walls, wall] })),

      updateWall: (id, updates) =>
        set((state) => ({
          walls: state.walls.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      removeWall: (id) =>
        set((state) => ({
          walls: state.walls.filter((w) => w.id !== id),
        })),

      setWalls: (walls) => set({ walls }),

      setDeteriorationItems: (items) =>
        set({ deteriorationItems: items }),

      toggleDeteriorationItem: (id) =>
        set((state) => ({
          deteriorationItems: state.deteriorationItems.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),

      setResult: (result) => set({ result }),

      setReinforcementPlan: (plan) =>
        set({ reinforcementPlan: plan }),

      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),

      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

      goToStep: (step) => set({ currentStep: step }),

      reset: () =>
        set({
          currentStep: 0,
          buildingInfo: {},
          walls: [],
          deteriorationItems: [],
          result: null,
          reinforcementPlan: null,
        }),
    }),
    { name: 'detailed-diagnosis' }
  )
)
