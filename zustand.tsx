import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist(set => ({
    currentName: '',
    setCurrentName: (currentName) => set({ currentName }),
})))
