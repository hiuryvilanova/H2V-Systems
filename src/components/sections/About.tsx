'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Target, Eye, Gem, Play, Terminal, RotateCw } from 'lucide-react'

export default function About() {
  const t = useTranslations('About')
  const locale = useLocale()

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  const [isRunning, setIsRunning] = useState(false)
  const [consoleLines, setConsoleLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(-1)

  const scriptLines = locale === 'pt' ? [
    'h2v.deliver(new Project("HighScaleSystem"));',
    '>> [INFO] Inicializando pipeline de implantação...',
    '>> [INFO] Analisando requisitos de arquitetura... [OK]',
    '>> [INFO] Compilando microsserviços em Kotlin & Java... [OK]',
    '>> [INFO] Executando 142 testes automatizados... [SUCESSO]',
    '>> [INFO] Deploy em nuvem híbrida de missão crítica... [OK]',
    '>> [SUCCESS] Entrega concluída com previsibilidade absoluta! (Uptime: 99.99%)'
  ] : locale === 'es' ? [
    'h2v.deliver(new Project("HighScaleSystem"));',
    '>> [INFO] Inicializando pipeline de despliegue...',
    '>> [INFO] Analizando requisitos de arquitectura... [OK]',
    '>> [INFO] Compilando microservicios en Kotlin & Java... [OK]',
    '>> [INFO] Ejecutando 142 pruebas automatizadas... [ÉXITO]',
    '>> [INFO] Despliegue en nube híbrida de misión crítica... [OK]',
    '>> [SUCCESS] ¡Entrega completada con previsibilidad absoluta! (Uptime: 99.99%)'
  ] : [
    'h2v.deliver(new Project("HighScaleSystem"));',
    '>> [INFO] Initializing deployment pipeline...',
    '>> [INFO] Analyzing architecture requirements... [OK]',
    '>> [INFO] Compiling microservices in Kotlin & Java... [OK]',
    '>> [INFO] Running 142 automated tests... [SUCCESS]',
    '>> [INFO] Deploying to mission-critical hybrid cloud... [OK]',
    '>> [SUCCESS] Delivery completed with absolute predictability! (Uptime: 99.99%)'
  ]

  const runCode = () => {
    if (isRunning) return
    setIsRunning(true)
    setConsoleLines([])
    setCurrentLineIndex(0)
  }

  const resetConsole = () => {
    setIsRunning(false)
    setConsoleLines([])
    setCurrentLineIndex(-1)
  }

  useEffect(() => {
    if (currentLineIndex < 0 || currentLineIndex >= scriptLines.length) {
      if (currentLineIndex >= scriptLines.length) {
        setIsRunning(false)
      }
      return
    }

    const timer = setTimeout(() => {
      setConsoleLines((prev) => [...prev, scriptLines[currentLineIndex]])
      setCurrentLineIndex((prev) => prev + 1)
    }, currentLineIndex === 0 ? 300 : 700)

    return () => clearTimeout(timer)
  }, [currentLineIndex])

  const values = [
    { icon: Target, title: t('missionTitle'), desc: t('missionDesc') },
    { icon: Eye,    title: t('visionTitle'),  desc: t('visionDesc')  },
    { icon: Gem,    title: t('valuesTitle'),  desc: t('valuesDesc')  },
  ]

  return (
    <section id="sobre" ref={sectionRef} className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden" style={{ background: 'var(--bg-1)' }}>
      <motion.div aria-hidden="true" className="absolute inset-[-20%] pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(194,65,12,0.045) 0%, transparent 60%)' }} />
      </motion.div>

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 items-center">

          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75 }}>
            <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mb-5 sm:mb-6">
              {t('title')}<br />
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h2>

            <p className="text-[0.95rem] leading-[1.8] mb-4" style={{ color: 'var(--text-70)' }}>
              {t.rich('p1', {
                strong: (chunks) => <strong style={{ color: 'var(--text-100)' }}>{chunks}</strong>,
              })}
            </p>
            <p className="text-[0.95rem] leading-[1.8]" style={{ color: 'var(--text-70)' }}>
              {t.rich('p2', {
                cyan: (chunks) => <strong style={{ color: 'var(--cyan)' }}>{chunks}</strong>,
              })}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col gap-4">
              {values.map((v) => {
                const Icon = v.icon
                return (
                <div key={v.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 min-w-[40px] rounded-lg flex items-center justify-center mt-0.5"
                    style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border)' }}>
                    <Icon size={18} strokeWidth={1.75} color="var(--cyan)" />
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] font-semibold mb-1">{v.title}</h4>
                    <p className="text-[0.85rem] leading-[1.65]" style={{ color: 'var(--text-70)' }}>{v.desc}</p>
                  </div>
                </div>
                )
              })}
            </div>
          </motion.div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75 }}
              className="about-terminal rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.35)] bg-[#0d0b0a]">
              {/* macOS style top bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#13100e] border-b border-neutral-800/65 select-none">
                <div className="flex gap-2">
                  {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                    <span key={c} className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c }} />
                  ))}
                </div>
                <div className="text-[10px] font-mono text-neutral-500 font-semibold tracking-wide flex items-center gap-1.5">
                  <span className="text-orange-500 font-bold">JS</span>
                  <span>philosophy.js</span>
                </div>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 active:scale-95 transition-all border border-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Play size={10} className={isRunning ? 'animate-spin' : ''} />
                  <span>{isRunning ? 'RUNNING...' : 'RUN'}</span>
                </button>
              </div>
              <div className="flex font-mono text-[0.74rem] sm:text-[0.84rem] leading-[1.8] p-4 sm:p-6 overflow-x-auto whitespace-pre">
                {/* Line Numbers */}
                <div className="text-neutral-700 select-none text-right pr-4 border-r border-neutral-800/40 flex flex-col">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span key={i} className="block w-4">{i + 1}</span>
                  ))}
                </div>
                {/* Code Block */}
                <pre className="pl-4 text-left flex-1" style={{ color: '#d4beab' }}>
                  <span className="text-[#8e8073] italic">{'// H2V Systems — Core Philosophy\n'}</span>
                  <span className="text-[#e0956e]">{'const '}</span><span className="text-[#ff8a4c]">{'h2v'}</span>{' = {\n'}
                  {'  founder:  '}<span className="text-[#a8c87a]">{"'Hiury Vilanova'"}</span>{',\n'}
                  {'  mission:  '}<span className="text-[#a8c87a]">{"'Build digital foundations'"}</span>{',\n'}
                  {'  stack:    [\n    '}<span className="text-[#a8c87a]">{"'Java'"}</span>{', '}<span className="text-[#a8c87a]">{"'Kotlin'"}</span>{', '}<span className="text-[#a8c87a]">{"'Spring'"}</span>{',\n    '}<span className="text-[#a8c87a]">{"'React'"}</span>{', '}<span className="text-[#a8c87a]">{"'Node'"}</span>{', '}<span className="text-[#a8c87a]">{"'AWS'"}</span>{'\n  ],\n'}
                  {'  values:   [\n    '}<span className="text-[#a8c87a]">{"'transparency'"}</span>{',\n    '}<span className="text-[#a8c87a]">{"'excellence'"}</span>{'\n  ],\n\n  '}
                  <span className="text-[#f5c97a]">{'deliver'}</span>{'(project) {\n    '}<span className="text-[#e0956e]">{'return'}</span>{' project\n      .plan().build()\n      .test().deploy('}<span className="text-[#a8c87a]">{"'production'"}</span>{');\n  }\n};\n'}
                </pre>
              </div>

              {/* Console drawer */}
              <AnimatePresence>
                {consoleLines.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-neutral-800 bg-[#070605] p-4 font-mono text-[0.7rem] sm:text-[0.78rem] leading-relaxed text-neutral-300"
                  >
                    <div className="flex items-center justify-between text-neutral-500 border-b border-neutral-800/40 pb-2 mb-3">
                      <span className="flex items-center gap-1.5 uppercase font-bold text-[9px] tracking-wider text-neutral-500">
                        <Terminal size={10} className="text-orange-500" />
                        Console Output
                      </span>
                      <button
                        onClick={resetConsole}
                        className="text-[9px] hover:text-white transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5 select-text">
                      {consoleLines.map((line, idx) => {
                        const isError = line.includes('[ERROR]')
                        const isSuccess = line.includes('[SUCCESS]') || line.includes('[SUCESSO]') || line.includes('[ÉXITO]')
                        const isInput = !line.startsWith('>>')
                        
                        let colorClass = 'text-neutral-400 font-medium'
                        if (isInput) colorClass = 'text-orange-300 font-semibold'
                        else if (isSuccess) colorClass = 'text-emerald-400 font-semibold'
                        else if (isError) colorClass = 'text-red-400 font-semibold'
                        else if (line.includes('[OK]')) colorClass = 'text-[#fafaf9]'

                        return (
                          <div key={idx} className={colorClass}>
                            {isInput ? '$ ' : ''}{line}
                          </div>
                        )
                      })}
                      {isRunning && (
                        <div className="text-orange-500 animate-pulse font-bold flex items-center gap-1">
                          <span>$</span>
                          <span className="w-1.5 h-3 bg-orange-500 inline-block align-middle" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75, delay: 0.15 }}
              className="glass-card rounded-2xl p-6 sm:p-7 border border-neutral-800/80 bg-neutral-900/30">
              <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--cyan)' }}>
                {t('founderLabel')}
              </h4>
              <p className="text-[0.9rem] leading-[1.7]" style={{ color: 'var(--text-70)' }}>
                <strong className="text-white">{t('founderLabel').includes('//') ? 'Hiury Vilanova' : ''}</strong> {t('founderDesc')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
