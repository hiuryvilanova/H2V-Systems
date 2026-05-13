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
        fixed bottom-[85px] right-5 sm:bottom-[104px] sm:right-8 z-[9998] w-10 h-10 sm:w-11 sm:h-11 rounded-lg
        flex items-center justify-center text-base cursor-pointer
        border transition-all duration-300
        hover:-translate-y-0.5
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
