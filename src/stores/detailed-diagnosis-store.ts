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
  lastSavedAt: string | null

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
  hasData: () => boolean
}

export const useDetailedDiagnosisStore = create<DetailedDiagnosisStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      buildingInfo: {},
      walls: [],
      deteriorationItems: [],
      result: null,
      reinforcementPlan: null,
      lastSavedAt: null,

      setBuildingInfo: (info) =>
        set((state) => ({
          buildingInfo: { ...state.buildingInfo, ...info },
          lastSavedAt: new Date().toISOString(),
        })),

      addWall: (wall) =>
        set((state) => ({
          walls: [...state.walls, wall],
          lastSavedAt: new Date().toISOString(),
        })),

      updateWall: (id, updates) =>
        set((state) => ({
          walls: state.walls.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
          lastSavedAt: new Date().toISOString(),
        })),

      removeWall: (id) =>
        set((state) => ({
          walls: state.walls.filter((w) => w.id !== id),
          lastSavedAt: new Date().toISOString(),
        })),

      setWalls: (walls) => set({ walls, lastSavedAt: new Date().toISOString() }),

      setDeteriorationItems: (items) =>
        set({ deteriorationItems: items, lastSavedAt: new Date().toISOString() }),

      toggleDeteriorationItem: (id) =>
        set((state) => ({
          deteriorationItems: state.deteriorationItems.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
          lastSavedAt: new Date().toISOString(),
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
          lastSavedAt: null,
        }),

      hasData: () => {
        const state = get()
        return (
          Object.keys(state.buildingInfo).length > 0 ||
          state.walls.length > 0 ||
          state.deteriorationItems.some((item) => item.checked)
        )
      },
    }),
    { name: 'detailed-diagnosis' }
  )
)
