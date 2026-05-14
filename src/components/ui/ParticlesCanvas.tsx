'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  color: string
}

type Props = {
  /** Linhas entre partículas — estilo “rede tech”; desligado fica mais sóbrio. */
  showLinks?: boolean
  /** Partículas mais suaves em fundo claro */
  soft?: boolean
  /** Menos partículas e mais discretas — fundo tipo consultoria premium */
  density?: 'normal' | 'sparse'
}

export default function ParticlesCanvas({ showLinks = true, soft = false, density = 'normal' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const isMobile        = window.matchMedia('(max-width: 768px)').matches
    const prefersReduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isLowPower      = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4

    if (prefersReduced) return
    if (isMobile && isLowPower) return

    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    let particles: Particle[] = []
    let animId = 0

    function resize() {
      W = canvas!.width = window.innerWidth
      H = canvas!.height = window.innerHeight
    }

    const sparse = density === 'sparse'
    const divisor = sparse ? 52000 : 12000
    const alphaMul = sparse ? (soft ? 0.12 : 0.22) : soft ? 0.5 : 1

    function makeParticle(): Particle {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * (sparse ? 1.0 : 1.5) + 0.25,
        vx: (Math.random() - 0.5) * (sparse ? 0.18 : 0.3),
        vy: (Math.random() - 0.5) * (sparse ? 0.18 : 0.3),
        a: (Math.random() * 0.45 + 0.08) * alphaMul,
        color: Math.random() > 0.55 ? '194,65,12' : '120,113,108',
      }
    }

    function init() {
      const raw = Math.floor((W * H) / divisor)
      const count = Math.min(sparse ? 48 : 96, Math.max(8, raw))
      particles = Array.from({ length: count }, makeParticle)
    }

    function drawConnections() {
      const maxDist = 120
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(120,113,108,${0.04 * (1 - dist / maxDist)})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          Object.assign(p, makeParticle())
        }
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${p.color},${p.a})`
        ctx!.fill()
      }
      if (showLinks) drawConnections()
      animId = requestAnimationFrame(draw)
    }

    resize()
    init()
    draw()

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(animId)
        resize()
        init()
        draw()
      }, 200)
    }

    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [enabled, showLinks, soft, density])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none"
    />
  )
}
