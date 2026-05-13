'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const dur   = 1800
    const start = performance.now()
    const tick  = (now: number) => {
      const progress = Math.min((now - start) / dur, 1)
      const ease     = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(target)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <div ref={ref} className="text-[2.8rem] font-black font-mono leading-none">
      <span style={{ background: 'linear-gradient(135deg, var(--text-100), var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {count}
      </span>
      <span style={{ color: 'var(--cyan)' }}>{suffix}</span>
    </div>
  )
}

export default function Stats() {
  const t = useTranslations('Stats')

  const items = [
    { target: 50,  suffix: '+',  label: t('projectsLabel')    },
    { target: 98,  suffix: '%',  label: t('satisfactionLabel') },
    { target: 3,   suffix: 'x',  label: t('reductionLabel')    },
    { target: 24,  suffix: '/7', label: t('supportLabel')      },
  ]

  return (
    <section id="stats" className="py-20 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-1)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'var(--border)' }}>
          {items.map((s) => (
            <div key={s.label} className="p-6 sm:p-8 text-center" style={{ background: 'var(--bg-1)' }}>
              <Counter target={s.target} suffix={s.suffix} />
              <p className="text-xs sm:text-sm mt-2 px-1 leading-snug" style={{ color: 'var(--text-70)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
