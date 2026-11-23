import { useEffect, useRef } from 'react'
import { useSimulationStore } from '../store/useSimulationStore'

const COLORS = {
  background: '#030916',
  cyan: '#22d3ee',
  blue: '#3b82f6',
  purple: '#a78bfa',
  green: '#4ade80',
  orange: '#fb923c',
  text: '#dbeafe',
  muted: '#7895b8',
}

const BASE_COLORS: Record<string, string> = {
  A: '#38bdf8',
  T: '#fb7185',
  C: '#fbbf24',
  G: '#4ade80',
  U: '#c084fc',
}

const COMPLEMENT: Record<string, string> = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C',
}


type Particle = {
  x: number
  y: number
  radius: number
  phase: number
  speed: number
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    x: ((i * 137.508) % 1000) / 1000,
    y: ((i * 263.17 + 31) % 1000) / 1000,
    radius: 0.5 + ((i * 7) % 15) / 10,
    phase: i * 1.73,
    speed: 0.3 + ((i * 13) % 10) / 10,
  }))
}

const PARTICLES = makeParticles(75)

function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha = 1,
) {
  ctx.save()
  ctx.globalAlpha = alpha

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, 'transparent')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawRoundedPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, 10)
  ctx.fill()
  ctx.stroke()
}

export default function AnimationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    let frameId = 0
    let width = 0
    let height = 0
    let lastTime = 0
    let elapsed = 0

    const sequence = dnaSequence.toUpperCase()
    const length = sequence.length

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      width = rect.width
      height = rect.height

      if (width <= 0 || height <= 0) return

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    resize()

    const draw = (time: number) => {
      frameId = requestAnimationFrame(draw)

      if (width <= 0 || height <= 0) return

      const delta = lastTime ? Math.min(time - lastTime, 50) : 16
      lastTime = time
      elapsed += delta * 0.001

      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = COLORS.background
      ctx.fillRect(0, 0, width, height)

      // Ambient lighting
      drawGlow(
        ctx,
        width * 0.47,
        height * 0.48,
        Math.min(width, height) * 0.48,
        '#075985',
        0.22,
      )

      drawGlow(
        ctx,
        width * 0.78,
        height * 0.75,
        Math.min(width, height) * 0.3,
        '#4c1d95',
        0.12,
      )

      // Scientific grid
      ctx.save()
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.055)'
      ctx.lineWidth = 1

      const gridSize = 32

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      ctx.restore()

      // Floating particles
      for (const particle of PARTICLES) {
        const x = particle.x * width
        const y =
          ((particle.y * height +
            Math.sin(elapsed * particle.speed + particle.phase) * 8) %
            height +
            height) %
          height

        const alpha =
          0.25 +
          (Math.sin(elapsed * 1.5 + particle.phase) + 1) * 0.3

        ctx.fillStyle = `rgba(103, 232, 249, ${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Scene dimensions
      const compact = width < 520
      const left = compact ? 25 : 48
      const right = width - (compact ? 25 : 48)
      const usableWidth = Math.max(1, right - left)
      const centerY = height * 0.43

      const amplitude = Math.min(height * 0.105, compact ? 27 : 39)
      const frequency = Math.PI * 2 / Math.max(90, usableWidth * 0.36)

      const baseSpacing =
        length > 0
          ? Math.min(usableWidth / Math.max(length, 1), compact ? 30 : 43)
          : 30

      const strandStart =
        length * baseSpacing < usableWidth
          ? (width - length * baseSpacing) / 2
          : left

      const strandEnd = strandStart + Math.max(
        baseSpacing,
        Math.min(length * baseSpacing, usableWidth),
      )

      const xForIndex = (index: number) =>
        strandStart +
        (length <= 1
          ? 0
          : index * (strandEnd - strandStart) / (length - 1))

      const wavePhase =
        animationStep === 'IDLE' ? elapsed * 0.32 : elapsed * 0.5

      const helixY = (x: number, strand: number) => {
        const angle = (x - left) * frequency + wavePhase
        return centerY + Math.sin(angle + strand * Math.PI) * amplitude
      }

      // DNA strands
      const drawStrand = (strand: number, color: string) => {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Soft glow
        ctx.beginPath()

        for (let x = left; x <= right; x += 3) {
          const y = helixY(x, strand)

          if (x === left) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.strokeStyle = color
        ctx.lineWidth = compact ? 8 : 12
        ctx.globalAlpha = 0.12
        ctx.shadowColor = color
        ctx.shadowBlur = 22
        ctx.stroke()

        // Core strand
        ctx.beginPath()

        for (let x = left; x <= right; x += 3) {
          const y = helixY(x, strand)

          if (x === left) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.globalAlpha = 0.95
        ctx.shadowBlur = 8
        ctx.strokeStyle = color
        ctx.lineWidth = compact ? 3 : 4
        ctx.stroke()

        ctx.restore()
      }

      drawStrand(0, COLORS.cyan)
      drawStrand(1, COLORS.purple)

      // Base pairs
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          const x = xForIndex(i)
          const y1 = helixY(x, 0)
          const y2 = helixY(x, 1)

          const isProcessed =
            animationStep !== 'IDLE' && i < currentIndex

          const isActive =
            animationStep === 'TRANSCRIBING' && i === currentIndex

          // Hydrogen bonds
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(x, y1)
          ctx.lineTo(x, y2)

          ctx.strokeStyle = isActive
            ? '#f0abfc'
            : isProcessed
              ? 'rgba(34, 211, 238, 0.85)'
              : 'rgba(148, 163, 184, 0.38)'

          ctx.lineWidth = isActive ? 2.5 : 1.5
          ctx.setLineDash(isProcessed ? [] : [3, 4])
          ctx.stroke()
          ctx.restore()

          // Nucleotide labels
          const base = sequence[i]
          const complement = COMPLEMENT[base] ?? '?'

          if (length <= 18 || i % Math.ceil(length / 18) === 0) {
            const fontSize = compact ? 10 : 12

            ctx.font = `bold ${fontSize}px monospace`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            ctx.fillStyle = BASE_COLORS[base] ?? '#ffffff'
            ctx.fillText(base, x, y1)

            ctx.fillStyle = BASE_COLORS[complement] ?? '#ffffff'
            ctx.fillText(complement, x, y2)
          }

          // Active nucleotide highlight
          if (isActive) {
            drawGlow(ctx, x, y1, compact ? 19 : 25, COLORS.cyan, 0.55)
          }
        }
      }

      // RNA polymerase position
      if (
        length > 0 &&
        animationStep !== 'IDLE' &&
        animationStep !== 'DONE'
      ) {
        const index = Math.min(currentIndex, length - 1)
        const enzymeX = xForIndex(index)
        const enzymeY = centerY - amplitude * 0.12

        drawGlow(ctx, enzymeX, enzymeY, compact ? 43 : 59, COLORS.cyan, 0.3)

        ctx.save()
        ctx.translate(enzymeX, enzymeY)
        ctx.rotate(Math.sin(elapsed * 1.8) * 0.055)

        // Outer enzyme shell
        ctx.beginPath()
        ctx.ellipse(
          0,
          0,
          compact ? 25 : 33,
          compact ? 19 : 25,
          0,
          0,
          Math.PI * 2,
        )

        const shell = ctx.createLinearGradient(-30, -20, 30, 25)
        shell.addColorStop(0, '#67e8f9')
        shell.addColorStop(0.5, '#0891b2')
        shell.addColorStop(1, '#312e81')

        ctx.fillStyle = shell
        ctx.shadowColor = COLORS.cyan
        ctx.shadowBlur = 22
        ctx.fill()

        ctx.shadowBlur = 0
        ctx.strokeStyle = '#a5f3fc'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Active site
        ctx.beginPath()
        ctx.ellipse(0, 3, 10, 7, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#083344'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(0, 3, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#f0abfc'
        ctx.shadowColor = '#f0abfc'
        ctx.shadowBlur = 10
        ctx.fill()

        ctx.restore()

        // Enzyme label
        ctx.font = `bold ${compact ? 9 : 11}px monospace`
        ctx.textAlign = 'center'
        ctx.fillStyle = '#cffafe'
        ctx.fillText(
          'RNA POLYMERASE',
          enzymeX,
          enzymeY - (compact ? 30 : 39),
        )
      }

      // Newly produced mRNA strand
      if (
        animationStep !== 'IDLE' &&
        mrnaSequence.length > 0 &&
        currentIndex > 0
      ) {
        const visibleCount = Math.min(currentIndex, mrnaSequence.length)
        const rnaY = Math.min(height - 75, centerY + amplitude * 2.7 + 20)

        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Curved RNA backbone
        ctx.beginPath()

        for (let i = 0; i < visibleCount; i++) {
          const x = xForIndex(i)
          const y = rnaY + Math.sin(i * 0.8 + elapsed) * 5

          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.strokeStyle = COLORS.orange
        ctx.lineWidth = 2.5
        ctx.shadowColor = COLORS.orange
        ctx.shadowBlur = 12
        ctx.stroke()
        ctx.shadowBlur = 0

        // RNA nucleotides
        for (let i = 0; i < visibleCount; i++) {
          const x = xForIndex(i)
          const y = rnaY + Math.sin(i * 0.8 + elapsed) * 5
          const base = mrnaSequence[i]

          ctx.fillStyle = BASE_COLORS[base] ?? COLORS.orange
          ctx.beginPath()
          ctx.arc(x, y, compact ? 3 : 4, 0, Math.PI * 2)
          ctx.fill()

          if (length <= 18 || i % Math.ceil(length / 18) === 0) {
            ctx.font = `bold ${compact ? 9 : 11}px monospace`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = '#ffedd5'
            ctx.fillText(base, x, y + 15)
          }
        }

        ctx.restore()

        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'left'
        ctx.fillStyle = COLORS.orange
        ctx.fillText('mRNA', left, rnaY + 34)
      }

      // Idle hint
      if (animationStep === 'IDLE') {
        const boxWidth = Math.min(width - 36, 290)
        const boxHeight = 55
        const boxX = (width - boxWidth) / 2
        const boxY = height - 83

        ctx.save()
        ctx.fillStyle = 'rgba(3, 15, 31, 0.88)'
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.28)'
        ctx.lineWidth = 1
        drawRoundedPanel(ctx, boxX, boxY, boxWidth, boxHeight)

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = COLORS.text
        ctx.font = 'bold 12px sans-serif'
        ctx.fillText('آزمایش رونویسی آماده است', width / 2, boxY + 20)

        ctx.fillStyle = COLORS.muted
        ctx.font = '10px sans-serif'
        ctx.fillText('برای شروع، دکمه اجرای آزمایش را بزنید', width / 2, boxY + 39)
        ctx.restore()
      }

      // Progress indicator
      const barWidth = Math.min(width - 36, 260)
      const barX = width - barWidth - 18
      const barY = 19

      ctx.save()
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.55)'
      ctx.lineWidth = 1
      drawRoundedPanel(ctx, barX, barY, barWidth, 28)

      ctx.fillStyle = COLORS.muted
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText('PROGRESS', barX + 10, barY + 14)

      ctx.textAlign = 'right'
      ctx.fillStyle = COLORS.text
      ctx.fillText(`${progress}%`, barX + barWidth - 10, barY + 14)

      ctx.restore()

      // Status indicator
      const status =
        animationStep === 'IDLE'
          ? 'READY TO SIMULATE'
          : animationStep === 'UNWINDING'
            ? 'DNA UNWINDING'
            : animationStep === 'TRANSCRIBING'
              ? 'RNA SYNTHESIS IN PROGRESS'
              : 'TRANSCRIPTION COMPLETE'

      ctx.save()
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.font = 'bold 9px monospace'
      ctx.fillStyle =
        animationStep === 'DONE'
          ? COLORS.green
          : animationStep === 'IDLE'
            ? COLORS.muted
            : COLORS.cyan

      ctx.fillText(status, 17, height - 14)
      ctx.restore()
    }

    frameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [dnaSequence, animationStep, currentIndex, mrnaSequence, progress])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="نمایش متحرک DNA، جفت‌بازها، RNA پلی‌مراز و رشته mRNA"
      className="molecular-canvas"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        minHeight: '300px',
      }}
    />
  )
}
