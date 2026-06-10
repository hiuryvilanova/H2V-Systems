'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Target, Eye, Gem, Play, Terminal } from 'lucide-react'

export default function About() {
  const t = useTranslations('About')
  const locale = useLocale()

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  const [isRunning, setIsRunning] = useState(false)
  const [consoleLines, setConsoleLines] = useState<string[]>([])
  const [cmdInput, setCmdInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const KNOWN_COMMANDS = ['help', 'stack', 'deliver', 'contact', 'clear', 'whoami', 'date'] as const

  const clearScheduledLines = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const scheduleLine = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay)
    timeoutsRef.current.push(id)
  }, [])

  useEffect(() => () => clearScheduledLines(), [clearScheduledLines])

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

  const runCommand = (cmd: string) => {
    if (isRunning) return

    if (cmd === 'clear') {
      clearScheduledLines()
      setConsoleLines([])
      setIsRunning(false)
      return
    }

    clearScheduledLines()
    setIsRunning(true)

    setConsoleLines((prev) => [...prev, cmd])

    let output: string[] = []
    if (cmd === 'help') {
      output = locale === 'pt' ? [
        '>> Comandos disponíveis:',
        '>>   help     - Mostra esta ajuda',
        '>>   stack    - Exibe as tecnologias principais',
        '>>   deliver  - Executa o pipeline de implantação',
        '>>   contact  - Informações de contato direto',
        '>>   clear    - Limpa o terminal'
      ] : locale === 'es' ? [
        '>> Comandos disponibles:',
        '>>   help     - Muestra esta ayuda',
        '>>   stack    - Muestra las tecnologías principales',
        '>>   deliver  - Ejecuta el pipeline de despliegue',
        '>>   contact  - Información de contacto directo',
        '>>   clear    - Limpia la consola'
      ] : [
        '>> Available commands:',
        '>>   help     - Show this help message',
        '>>   stack    - View core technologies',
        '>>   deliver  - Run deployment pipeline',
        '>>   contact  - View direct contact details',
        '>>   clear    - Clear console'
      ]
    } else if (cmd === 'stack') {
      output = [
        '>> Stack principal:',
        '>>   - Backend: Java, Kotlin, Spring Boot, Node.js',
        '>>   - Frontend: TypeScript, React, Next.js (Turbopack)',
        '>>   - Infraestrutura: AWS Cloud, Docker, Kubernetes, Terraform',
        '>>   - Mensageria/Dados: Apache Kafka, PostgreSQL, Redis, MongoDB'
      ]
    } else if (cmd === 'contact') {
      output = locale === 'pt' ? [
        '>> Informações de Contato:',
        '>>   - E-mail: hiuryhenrique2012@gmail.com',
        '>>   - Telefone: +55 (61) 99172-0301',
        '>>   - WhatsApp: Ativo no canto esquerdo da tela'
      ] : locale === 'es' ? [
        '>> Información de Contacto:',
        '>>   - Correo: hiuryhenrique2012@gmail.com',
        '>>   - Teléfono: +55 (61) 99172-0301',
        '>>   - WhatsApp: Activo en la esquina inferior izquierda'
      ] : [
        '>> Contact Information:',
        '>>   - Email: hiuryhenrique2012@gmail.com',
        '>>   - Phone: +55 (61) 99172-0301',
        '>>   - WhatsApp: Active on the bottom-left corner'
      ]
    } else if (cmd === 'whoami') {
      output = [
        '>> guest@h2vsystems ~ ',
        '>>   visitor (read-only shell)',
        '>>   permissions: explore | type "help" for command list'
      ]
    } else if (cmd === 'date') {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      output = [`>> ${now} UTC`]
    } else if (cmd === 'deliver') {
      const pipelineLines = scriptLines.slice(1)
      let tempIndex = 0
      const nextLine = () => {
        if (tempIndex >= pipelineLines.length) {
          setIsRunning(false)
          return
        }
        const line = pipelineLines[tempIndex]
        if (line) setConsoleLines((prev) => [...prev, line])
        tempIndex++
        scheduleLine(nextLine, 600)
      }
      scheduleLine(nextLine, 300)
      return
    } else {
      const msg = locale === 'pt'
        ? `>> [ERROR] Comando "${cmd}" não reconhecido. Digite "help" para listar.`
        : locale === 'es'
        ? `>> [ERROR] Comando "${cmd}" no reconocido. Escribe "help" para listar.`
        : `>> [ERROR] Command "${cmd}" not recognized. Type "help" to list.`
      output = [msg]
    }

    let tempIndex = 0
    const nextLine = () => {
      if (tempIndex >= output.length) {
        setIsRunning(false)
        return
      }
      const line = output[tempIndex]
      if (line) setConsoleLines((prev) => [...prev, line])
      tempIndex++
      scheduleLine(nextLine, 200)
    }
    scheduleLine(nextLine, 150)
  }

  const runCode = () => {
    runCommand('deliver')
  }

  const submitInput = () => {
    const raw = cmdInput.trim()
    if (!raw || isRunning) return
    setCmdHistory((prev) => [...prev, raw])
    setHistoryIdx(-1)
    setCmdInput('')
    runCommand(raw.toLowerCase())
  }

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitInput()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const next = historyIdx < 0 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(next)
      setCmdInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx < 0) return
      const next = historyIdx + 1
      if (next >= cmdHistory.length) {
        setHistoryIdx(-1)
        setCmdInput('')
      } else {
        setHistoryIdx(next)
        setCmdInput(cmdHistory[next] ?? '')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = KNOWN_COMMANDS.find((c) => c.startsWith(cmdInput.toLowerCase()))
      if (match) setCmdInput(match)
    }
  }

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [consoleLines, isRunning])

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

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 items-center min-w-0">

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
          <div className="flex flex-col gap-6 min-w-0">
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75 }}
              className="about-terminal rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.35)] bg-[#0d0b0a] min-w-0 w-full max-w-full">
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
              <div className="flex font-mono text-[0.74rem] sm:text-[0.84rem] leading-[1.8] p-4 sm:p-6 overflow-x-auto min-w-0 w-full">
                {/* Line Numbers */}
                <div className="text-neutral-700 select-none text-right pr-4 border-r border-neutral-800/40 flex flex-col flex-shrink-0">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span key={i} className="block w-4">{i + 1}</span>
                  ))}
                </div>
                {/* Code Block */}
                <pre className="pl-4 text-left flex-1 min-w-0 whitespace-pre" style={{ color: '#d4beab' }}>
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
                {(consoleLines.length > 0 || isRunning) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-neutral-800 bg-[#070605] p-4 font-mono text-[0.7rem] sm:text-[0.78rem] leading-relaxed text-neutral-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-neutral-500 border-b border-neutral-800/40 pb-2.5 mb-3">
                      <span className="flex items-center gap-1.5 uppercase font-bold text-[9px] tracking-wider text-neutral-500">
                        <Terminal size={10} className="text-orange-500" />
                        Console Output
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono">
                        <span className="text-neutral-600 uppercase font-semibold">Executar:</span>
                        {['help', 'stack', 'deliver', 'contact', 'clear'].map((cmd) => (
                          <button
                            key={cmd}
                            onClick={() => runCommand(cmd)}
                            disabled={isRunning}
                            className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 hover:border-orange-500/30 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {cmd}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div
                      ref={outputRef}
                      onClick={() => inputRef.current?.focus()}
                      className="flex flex-col gap-1.5 select-text max-h-[220px] overflow-y-auto cursor-text"
                    >
                      {consoleLines.map((line, idx) => {
                        const text = typeof line === 'string' ? line : ''
                        const isError = text.includes('[ERROR]')
                        const isSuccess = text.includes('[SUCCESS]') || text.includes('[SUCESSO]') || text.includes('[ÉXITO]')
                        const isInput = !text.startsWith('>>')
                        
                        let colorClass = 'text-neutral-400 font-medium'
                        if (isInput) colorClass = 'text-orange-300 font-semibold'
                        else if (isSuccess) colorClass = 'text-emerald-400 font-semibold'
                        else if (isError) colorClass = 'text-red-400 font-semibold'
                        else if (text.includes('[OK]')) colorClass = 'text-[#fafaf9]'

                        return (
                          <div key={idx} className={colorClass}>
                            {isInput ? '$ ' : ''}{text}
                          </div>
                        )
                      })}
                      {isRunning && (
                        <div className="text-orange-500 animate-pulse font-bold flex items-center gap-1">
                          <span>$</span>
                          <span className="w-1.5 h-3 bg-orange-500 inline-block align-middle" />
                        </div>
                      )}

                      {/* Interactive prompt */}
                      {!isRunning && (
                        <form
                          onSubmit={(e) => { e.preventDefault(); submitInput() }}
                          className="flex items-center gap-2 mt-1.5"
                        >
                          <span className="text-orange-400 font-bold select-none">$</span>
                          <input
                            ref={inputRef}
                            type="text"
                            value={cmdInput}
                            onChange={(e) => setCmdInput(e.target.value)}
                            onKeyDown={onInputKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                            aria-label="Terminal input"
                            placeholder={locale === 'pt' ? 'digite "help"...' : locale === 'es' ? 'escribe "help"...' : 'type "help"...'}
                            className="flex-1 bg-transparent outline-none border-0 text-orange-200 placeholder-neutral-700 font-mono text-[0.7rem] sm:text-[0.78rem] caret-orange-500"
                          />
                        </form>
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
