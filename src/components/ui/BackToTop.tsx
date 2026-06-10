'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggle = () => setVisible(window.pageYOffset > 500)
    window.addEventListener('scroll', toggle, { passive: true })
    return () => window.removeEventListener('scroll', toggle)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
      className={`
        fixed z-[9998] w-11 h-11 sm:w-11 sm:h-11 rounded-lg
        flex items-center justify-center text-base cursor-pointer min-h-11 min-w-11
        border transition-all duration-300
        hover:-translate-y-0.5
        back-to-top-pos
        ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        color: 'var(--text-70)',
      }}
    >
      ↑
    </button>
  )
}
