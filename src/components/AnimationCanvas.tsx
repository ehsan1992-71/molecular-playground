import { useRef, useEffect } from 'react'
import { useSimulationStore } from '../store/useSimulationStore'

// ====== رنگ‌های مولکول‌ها ======
const COLORS = {
  background: '#020617',
  dnaStrand1: '#3b82f6',    // آبی
  dnaStrand2: '#ef4444',    // قرمز
  polymerase: '#06b6d4',    // فیروزه‌ای
  nucleotide: {
    A: '#3b82f6',  // آبی
    T: '#ef4444',  // قرمز
    C: '#eab308',  // زرد
    G: '#22c55e',  // سبز
    U: '#10b981',  // سبز-آبی (mRNA)
  },
  mrna: '#10b981',         // رنگ mRNA
  text: '#94a3b8',
}

export default function AnimationCanvas() {
  // ref برای دسترسی به canvas واقعی توی DOM
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // داده‌ها از Store
  const dnaSequence = useSimulationStore((s) => s.dnaSequence)
  const animationStep = useSimulationStore((s) => s.animationStep)
  const currentIndex = useSimulationStore((s) => s.currentIndex)
  const mrnaSequence = useSimulationStore((s) => s.mrnaSequence)
  const progress = useSimulationStore((s) => s.progress)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // سایز canvas رو به اندازه واقعی صفحه تنظیم کن
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    
    // پس‌زمینه
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const W = canvas.width
    const H = canvas.height
    const centerY = H / 2
    
    // اگر هنوز شروع نشده، پیام راهنما نشون بده
    if (animationStep === 'IDLE') {
      ctx.fillStyle = COLORS.text
      ctx.font = '18px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('🧪 برای شروع دکمه "شروع" را بزنید', W/2, H/2 - 20)
      ctx.font = '14px monospace'
      ctx.fillText('توالی DNA: ' + dnaSequence, W/2, H/2 + 20)
      return
    }
    
    // ======= رسم DNA =======
    const dnaStartX = 60
    const dnaEndX = W - 60
    const dnaLength = dnaEndX - dnaStartX
    const baseSpacing = Math.min(dnaLength / dnaSequence.length, 40)
    
    // رسم دو رشته DNA به صورت دو خط موازی
    ctx.strokeStyle = COLORS.dnaStrand1
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(dnaStartX, centerY - 15)
    ctx.lineTo(dnaEndX, centerY - 15)
    ctx.stroke()
    
    ctx.strokeStyle = COLORS.dnaStrand2
    ctx.beginPath()
    ctx.moveTo(dnaStartX, centerY + 15)
    ctx.lineTo(dnaEndX, centerY + 15)
    ctx.stroke()
    
    // رسم بازهای DNA (A-T, C-G)
    for (let i = 0; i < dnaSequence.length; i++) {
      const x = dnaStartX + i * baseSpacing + baseSpacing / 2
      
      // خط اتصال بین دو رشته (پیوند هیدروژنی)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(x, centerY - 13)
      ctx.lineTo(x, centerY + 13)
      ctx.stroke()
      ctx.setLineDash([])
      
      // متن بازها
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'center'
      
      // باز رشته بالا
      const base1 = dnaSequence[i]
      ctx.fillStyle = COLORS.nucleotide[base1 as keyof typeof COLORS.nucleotide] || '#fff'
      ctx.fillText(base1, x, centerY - 20)
      
      // باز رشته پایین (مکمل)
      const complement: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' }
      const base2 = complement[base1]
      ctx.fillStyle = COLORS.nucleotide[base2 as keyof typeof COLORS.nucleotide] || '#fff'
      ctx.fillText(base2, x, centerY + 28)
    }
    
    // ======= رسم mRNA در حال ساخت =======
    if (mrnaSequence && currentIndex > 0) {
      const mrnaY = centerY + 65
      
      ctx.fillStyle = COLORS.text
      ctx.font = '11px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('mRNA:', 10, mrnaY + 4)
      
      for (let i = 0; i < currentIndex && i < mrnaSequence.length; i++) {
        const x = dnaStartX + i * baseSpacing + baseSpacing / 2
        const base = mrnaSequence[i]
        ctx.fillStyle = COLORS.nucleotide[base as keyof typeof COLORS.nucleotide] || COLORS.mrna
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(base, x, mrnaY)
      }
    }
    
    // ======= رسم RNA Polymerase =======
    if (currentIndex < dnaSequence.length) {
      const polymeraseX = dnaStartX + currentIndex * baseSpacing + baseSpacing / 2
      
      // بدنه آنزیم (بیضی)
      ctx.fillStyle = COLORS.polymerase
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.ellipse(polymeraseX, centerY, 18, 30, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      
      // حاشیه
      ctx.strokeStyle = '#0891b2'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(polymeraseX, centerY, 18, 30, 0, 0, Math.PI * 2)
      ctx.stroke()
      
      // متن RNA Pol
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 8px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('RNA', polymeraseX, centerY - 4)
      ctx.fillText('Pol', polymeraseX, centerY + 8)
    }
    
    // ======= نوار پیشرفت =======
    ctx.fillStyle = COLORS.text
    ctx.font = '12px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${progress}%`, W - 20, H - 20)
    
    // ======= وضعیت =======
    const statusText = 
      animationStep === 'UNWINDING' ? 'باز شدن مارپیچ DNA...' :
      animationStep === 'TRANSCRIBING' ? 'در حال رونویسی...' :
      animationStep === 'DONE' ? '✅ رونویسی کامل شد!' : ''
    
    ctx.fillStyle = COLORS.text
    ctx.font = '14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(statusText, W/2, H - 30)
    
  }, [dnaSequence, animationStep, currentIndex, mrnaSequence, progress])

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-cyan-400 mb-3">
        🔬 صحنه مولکولی
      </h2>
      
      <div className="relative bg-gray-950 border border-gray-800 rounded-lg overflow-hidden"
           style={{ height: '400px' }}>
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}