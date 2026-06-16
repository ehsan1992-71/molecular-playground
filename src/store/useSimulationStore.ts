import { create } from 'zustand'
import { transcribeDNA, validateDNA } from '../utils/transcription'

export type AnimationStep = 
  | 'IDLE'          // هیچ کاری نشده
  | 'UNWINDING'     // مارپیچ DNA داره باز میشه
  | 'TRANSCRIBING'  // RNA Polymerase در حال ساختن mRNA
  | 'DONE'          // رونویسی تموم شده

  export const useSimulationStore = create((set, get) => ({
  // ======== DATA (داده‌ها) ========
  dnaSequence: 'ATGCGTACC',   // توالی DNA پیش‌فرض
  mrnaSequence: '',           // mRNA ساخته شده (اولش خالیه)
  errorMessage: '',           // پیام خطا
  animationStep: 'IDLE',      // مرحله فعلی انیمیشن
  currentIndex: 0,            // RNA Polymerase روی کدوم نوکلئوتیده؟
  isPlaying: false,           // انیمیشن در حال پخشه؟
  speed: 1000,                // سرعت (میلی‌ثانیه)
  progress: 0, 
  attempts:0,               // درصد پیشرفت

  // ======== ACTIONS (کارهایی که می‌تونیم انجام بدیم) ========

  // ست کردن توالی DNA (وقتی کاربر تایپ می‌کنه)
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

  // شروع رونویسی
  startTranscription: () => {
    const state = get()
    if (state.errorMessage) return // اگر خطا داره، شروع نکن
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

  // توقف موقت
  pauseTranscription: () => {
    set({ isPlaying: false })
  },

  // یک مرحله جلو رفتن (Step by Step)
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

  // بازنشانی کامل
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

  // تنظیم سرعت
  setSpeed: (newSpeed: number) => {
    set({ speed: newSpeed })
  },

  // یک قدم خودکار (برای useEffect توی App.tsx)
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