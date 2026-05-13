'use client'

import { useEffect, useState } from 'react'

export default function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0) setProgress((window.pageYOffset / total) * 100)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[2000] h-[3px] transition-[width] duration-100"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, var(--cyan), var(--blue))',
        boxShadow: '0 0 10px var(--cyan-glow)',
      }}
    />
  )
}
