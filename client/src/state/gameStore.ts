import { create } from 'zustand'

type GameState = {
  health: number
  ammo: number
  isPaused: boolean
  isFocused: boolean
  setHealth: (h: number) => void
  setAmmo: (a: number) => void
  setPaused: (p: boolean) => void
  setFocused: (f: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
  health: 100,
  ammo: 100,
  isPaused: false,
  isFocused: false,
  setHealth: (h: number) => set({ health: h }),
  setAmmo: (a: number) => set({ ammo: a }),
  setPaused: (p: boolean) => set({ isPaused: p }),
  setFocused: (f: boolean) => set({ isFocused: f }),
}))
