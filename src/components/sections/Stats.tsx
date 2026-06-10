'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const dur   = 2000
    const start = performance.now()
    const tick  = (now: number) => {
      const progress = Math.min((now - start) / dur, 1)
      const ease     = 1 - Math.pow(1 - progress, 4) // Quartic out ease for ultra-smooth settling
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(target)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <div ref={ref} className="text-[clamp(2rem,7vw,3.25rem)] font-extrabold leading-none tabular-nums tracking-tight mb-2">
      <span className="text-white drop-shadow-[0_2px_10px_rgba(251,146,60,0.15)]">{count}</span>
      <span className="text-orange-400 drop-shadow-[0_2px_10px_rgba(251,146,60,0.15)]">{suffix}</span>
    </div>
  )
}

function StatCard({ s, index }: { s: { target: number; suffix: string; label: string }; index: number }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onMouseMove={handleMouseMove}
      className="spotlight-card p-6 sm:p-8 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md flex flex-col justify-center items-center text-center min-w-0 transition-all duration-300 hover:bg-neutral-900/50 hover:shadow-[0_8px_32px_rgba(249,115,22,0.06)] group relative overflow-hidden"
    >
      {/* Top glowing line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }}
      />

      <div className="relative z-10">
        <Counter target={s.target} suffix={s.suffix} />
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-400 mt-2 px-1 leading-snug group-hover:text-neutral-200 transition-colors duration-300">
          {s.label}
        </p>
      </div>
    </motion.div>
  )
}

export default function Stats() {
  const t = useTranslations('Stats')

  const items = [
    { target: 50,  suffix: '+',   label: t('projectsLabel')    },
    { target: 99,  suffix: '.9%', label: t('satisfactionLabel') },
    { target: 50,  suffix: '%',   label: t('reductionLabel')    },
    { target: 24,  suffix: '/7',  label: t('supportLabel')      },
  ]

  return (
    <section
      id="stats"
      className="py-16 sm:py-20 relative overflow-hidden bg-neutral-950 border-y border-neutral-900"
    >
      {/* Background glow points */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-orange-950/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-red-950/15 blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 xl:gap-10">
          {items.map((s, i) => (
            <StatCard key={s.label} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
