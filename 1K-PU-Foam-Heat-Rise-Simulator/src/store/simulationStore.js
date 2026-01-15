import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSimulationStore = create(
  persist(
    (set, get) => ({
      simulations: [],
      currentSimulation: null,
      draftSimulation: null,

      addSimulation: (simulation) => {
        const newSimulation = {
          ...simulation,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'completed',
        }
        set((state) => ({
          simulations: [newSimulation, ...state.simulations],
          currentSimulation: newSimulation,
        }))
        return newSimulation
      },

      updateSimulation: (id, updates) => {
        set((state) => ({
          simulations: state.simulations.map((sim) =>
            sim.id === id ? { ...sim, ...updates } : sim
          ),
        }))
      },

      deleteSimulation: (id) => {
        set((state) => ({
          simulations: state.simulations.filter((sim) => sim.id !== id),
          currentSimulation:
            state.currentSimulation?.id === id ? null : state.currentSimulation,
        }))
      },

      setCurrentSimulation: (simulation) => {
        set({ currentSimulation: simulation })
      },

      saveDraft: (draft) => {
        set({ draftSimulation: draft })
      },

      loadDraft: () => {
        return get().draftSimulation
      },

      clearDraft: () => {
        set({ draftSimulation: null })
      },

      getSimulationById: (id) => {
        return get().simulations.find((sim) => sim.id === id)
      },

      getSimulationsByDateRange: (startDate, endDate) => {
        return get().simulations.filter((sim) => {
          const simDate = new Date(sim.createdAt)
          return simDate >= startDate && simDate <= endDate
        })
      },
    }),
    {
      name: 'simulation-storage',
      partialize: (state) => ({
        simulations: state.simulations,
        draftSimulation: state.draftSimulation,
      }),
    }
  )
)

export default useSimulationStore