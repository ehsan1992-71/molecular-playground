import { create } from 'zustand'
import { transcribeDNA, validateDNA } from '../utils/transcription'

// ۱. تعریف رسمی مراحل انیمیشن
export type AnimationStep = 
  | 'IDLE'          
  | 'UNWINDING'     
  | 'TRANSCRIBING'  
  | 'DONE'          

// ۲. تعریف رسمی ساختار کل State (این همان چیزی است که TS گمش کرده بود!)
interface SimulationState {
  // Data
  dnaSequence: string
  mrnaSequence: string
  errorMessage: string
  animationStep: AnimationStep
  currentIndex: number
  isPlaying: boolean
  speed: number
  progress: number
  attempts: number

  // Actions
  setDNASequence: (sequence: string) => void
  startTranscription: () => void
  pauseTranscription: () => void
  stepForward: () => void
  reset: () => void
  setSpeed: (newSpeed: number) => void
  advanceAnimation: () => void
}

// ۳. ساخت Store با استفاده از تایپ تعریف شده
export const useSimulationStore = create<SimulationState>((set, get) => ({
  // ======== DATA ========
  dnaSequence: 'ATGCGTACC',   
  mrnaSequence: '',           
  errorMessage: '',           
  animationStep: 'IDLE',      
  currentIndex: 0,            
  isPlaying: false,           
  speed: 1000,                
  progress: 0, 
  attempts: 0,               

  // ======== ACTIONS ========
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
    if (state.errorMessage) return 
    const mrna = transcribeDNA(state.dnaSequence)
    set({
      mrnaSequence: mrna,
      animationStep: 'UNWINDING',
      isPlaying: true,
      currentIndex: 0,
      progress: 0,
      attempts: state.attempts + 1,
    })
  },

  pauseTranscription: () => {
    set({ isPlaying: false })
  },

  stepForward: () => {
    const state = get()
    if (state.animationStep === 'IDLE' || state.animationStep === 'DONE') return
    const newIndex = state.currentIndex + 1
    const dnaLength = state.dnaSequence.length
    if (newIndex >= dnaLength) {
      set({
        animationStep: 'DONE',
        isPlaying: false,
        progress: 100,
        currentIndex: dnaLength,
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
      attempts: 0,
    })
  },

  setSpeed: (newSpeed: number) => {
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
    const newIndex = state.currentIndex + 1
    const dnaLength = state.dnaSequence.length
    if (newIndex >= dnaLength) {
      set({
        animationStep: 'DONE',
        isPlaying: false,
        progress: 100,
        currentIndex: dnaLength,
      })
    } else {
      set({
        currentIndex: newIndex,
        progress: Math.round((newIndex / dnaLength) * 100),
      })
    }
  },
}))