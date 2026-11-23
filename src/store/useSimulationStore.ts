import { create } from 'zustand'
import { transcribeDNA, validateDNA } from '../utils/transcription'

export type AnimationStep = 'IDLE' | 'UNWINDING' | 'TRANSCRIBING' | 'DONE'

interface SimulationState {
  dnaSequence: string
  mrnaSequence: string
  errorMessage: string
  animationStep: AnimationStep
  currentIndex: number
  isPlaying: boolean
  speed: number
  progress: number

  setDNASequence: (sequence: string) => void
  startTranscription: () => void
  pauseTranscription: () => void
  stepForward: () => void
  reset: () => void
  setSpeed: (newSpeed: number) => void
  advanceAnimation: () => void
}

export const useSimulationStore = create<SimulationState>()((set, get) => ({
  dnaSequence: 'ATGCGTACC',
  mrnaSequence: '',
  errorMessage: '',
  animationStep: 'IDLE',
  currentIndex: 0,
  isPlaying: false,
  speed: 1000,
  progress: 0,

  setDNASequence: (sequence: string) => {
    const upper = sequence.toUpperCase()
    const validation = validateDNA(upper)

    set({
      dnaSequence: upper,
      mrnaSequence: '',
      errorMessage: validation.errorMessage,
      animationStep: 'IDLE',
      currentIndex: 0,
      isPlaying: false,
      progress: 0,
    })
  },

  startTranscription: () => {
    const state = get()
    const validation = validateDNA(state.dnaSequence)

    if (!validation.isValid) {
      set({
        errorMessage: validation.errorMessage,
        isPlaying: false,
      })
      return
    }

    const mrna = transcribeDNA(state.dnaSequence)

    set({
      mrnaSequence: mrna,
      errorMessage: '',
      animationStep: 'UNWINDING',
      isPlaying: true,
      currentIndex: 0,
      progress: 0,
    })
  },

  pauseTranscription: () => {
    set({ isPlaying: false })
  },

  stepForward: () => {
    const state = get()

    if (
      state.animationStep === 'IDLE' ||
      state.animationStep === 'DONE'
    ) {
      return
    }

    const dnaLength = state.dnaSequence.length

    if (dnaLength === 0) {
      set({
        animationStep: 'DONE',
        isPlaying: false,
        currentIndex: 0,
        progress: 100,
      })
      return
    }

    const newIndex = state.currentIndex + 1

    if (newIndex >= dnaLength) {
      set({
        animationStep: 'DONE',
        isPlaying: false,
        currentIndex: dnaLength,
        progress: 100,
      })
    } else {
      set({
        animationStep: 'TRANSCRIBING',
        currentIndex: newIndex,
        progress: Math.round((newIndex / dnaLength) * 100),
      })
    }
  },

  reset: () => {
    set({
      mrnaSequence: '',
      animationStep: 'IDLE',
      currentIndex: 0,
      isPlaying: false,
      progress: 0,
    })
  },

  setSpeed: (newSpeed: number) => {
    if (!Number.isFinite(newSpeed) || newSpeed <= 0) return
    set({ speed: newSpeed })
  },

  advanceAnimation: () => {
    const state = get()

    if (!state.isPlaying) return

    if (state.animationStep === 'DONE') {
      set({ isPlaying: false })
      return
    }

    if (state.animationStep === 'UNWINDING') {
      set({ animationStep: 'TRANSCRIBING' })
      return
    }

    const dnaLength = state.dnaSequence.length

    if (dnaLength === 0) {
      set({
        animationStep: 'DONE',
        isPlaying: false,
        currentIndex: 0,
        progress: 100,
      })
      return
    }

    const newIndex = state.currentIndex + 1

    if (newIndex >= dnaLength) {
      set({
        animationStep: 'DONE',
        isPlaying: false,
        currentIndex: dnaLength,
        progress: 100,
      })
    } else {
      set({
        currentIndex: newIndex,
        progress: Math.round((newIndex / dnaLength) * 100),
      })
    }
  },
}))
