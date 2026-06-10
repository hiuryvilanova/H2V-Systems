'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Globe, Smartphone, Cpu, Database, ShoppingBag, Radio,
  ArrowRight, ArrowLeft, RotateCcw, Calendar,
  HelpCircle, CheckCircle, Zap, Shield, DollarSign,
  AlertTriangle, Users, Clock, BarChart3, Layers as LayersIcon,
  Server, Cloud, Activity, GitBranch, Copy, Download, Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  recommend,
  recommendationToMarkdown,
  type Answers,
  type ProductType,
  type Scale,
  type Focus,
  type Budget,
  type TeamSize,
  type StackCategory,
  type Recommendation,
} from '@/lib/architecture-engine'

const CATEGORY_META: Record<StackCategory, { icon: LucideIcon; label: string }> = {
  frontend:      { icon: Globe,     label: 'Frontend' },
  backend:       { icon: Server,    label: 'Backend' },
  database:      { icon: Database,  label: 'Database' },
  cache:         { icon: Zap,       label: 'Cache' },
  messaging:     { icon: Radio,     label: 'Messaging' },
  cloud:         { icon: Cloud,     label: 'Cloud / Infra' },
  observability: { icon: Activity,  label: 'Observability' },
  cicd:          { icon: GitBranch, label: 'CI/CD' },
  security:      { icon: Shield,    label: 'Security' },
}

const STEPS = 4

export default function ArchitectureSimulator() {
  const t = useTranslations('Simulator')
  const [step, setStep] = useState(1)
  const [copied, setCopied] = useState(false)
  const [answers, setAnswers] = useState<Answers>({
    type:   'webapp',
    scale:  'medium',
    focus:  'latency',
    budget: 'growth',
    team:   'small',
  })

  const handleSelect = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers(prev => ({ ...prev, [key]: value }))

  const nextStep = () => setStep(p => Math.min(STEPS + 1, p + 1))
  const prevStep = () => setStep(p => Math.max(1, p - 1))
  const restart = () => {
    setStep(1)
    setCopied(false)
    setAnswers({ type: 'webapp', scale: 'medium', focus: 'latency', budget: 'growth', team: 'small' })
  }

  const rec: Recommendation = useMemo(() => recommend(answers), [answers])
  const totalWeeks = useMemo(() => rec.timeline.reduce((s, p) => s + p.weeks, 0), [rec.timeline])

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(recommendationToMarkdown(answers, rec))
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // silencioso: clipboard pode estar bloqueado
    }
  }

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify({ answers, recommendation: rec }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `h2v-blueprint-${answers.type}-${Date.now()}.json`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section id="simulador" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden bg-neutral-950 border-t border-neutral-900">
      {/* Background gradients */}
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-orange-950/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-red-950/10 blur-[130px] pointer-events-none" />

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-[680px] mx-auto">
          <span className="tag-badge">{t('tag')}</span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mt-4 mb-5 text-white">
            {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
          </h2>
          <p className="section-subtitle max-w-[560px] mx-auto text-neutral-400">{t('subtitle')}</p>
        </div>

        {/* Wizard Container */}
        <div className="max-w-[1100px] mx-auto bg-neutral-900/35 border border-neutral-800/80 backdrop-blur-md rounded-3xl p-4 sm:p-10 xl:p-12 relative">

          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 gap-3 sm:gap-4">
            {Array.from({ length: STEPS }).map((_, i) => {
              const idx = i + 1
              const done = step > idx
              const active = step === idx
              return (
                <div key={idx} className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border transition-all duration-300 flex-shrink-0 ${
                    done ? 'bg-orange-500 border-orange-500 text-white'
                    : active ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-600'
                  }`}>
                    {done ? <CheckCircle size={13} /> : idx}
                  </div>
                  {idx < STEPS && (
                    <div className="flex-1 h-[2px] bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                        initial={false}
                        animate={{ width: done ? '100%' : '0%' }}
                        transition={{ duration: 0.35 }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Tipo de produto */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{t('step1Title')}</h3>
                <p className="text-sm text-neutral-400 mb-6">{t('step1Desc')}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {([
                    { val: 'webapp',    label: t('optionWebApp'),     icon: Globe },
                    { val: 'mobile',    label: t('optionMobileApp'),  icon: Smartphone },
                    { val: 'api',       label: t('optionAPI'),        icon: Cpu },
                    { val: 'data',      label: t('optionData'),       icon: Database },
                    { val: 'ecommerce', label: t('optionEcommerce'),  icon: ShoppingBag },
                    { val: 'realtime',  label: t('optionRealtime'),   icon: Radio },
                  ] as Array<{ val: ProductType; label: string; icon: LucideIcon }>).map(opt => {
                    const Icon = opt.icon
                    const isSelected = answers.type === opt.val
                    return (
                      <button
                        key={opt.val}
                        onClick={() => handleSelect('type', opt.val)}
                        className={`simulator-option-card flex items-center gap-3 p-4 rounded-xl text-left font-semibold text-sm cursor-pointer ${isSelected ? 'selected text-white' : 'text-neutral-300'}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0 ${isSelected ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
                          <Icon size={18} />
                        </div>
                        <span className="leading-tight">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Escala */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{t('step2Title')}</h3>
                <p className="text-sm text-neutral-400 mb-6">{t('step2Desc')}</p>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {([
                    { val: 'low',    label: t('scaleLow'),    desc: t('scaleLowDesc'),    icon: HelpCircle },
                    { val: 'medium', label: t('scaleMedium'), desc: t('scaleMediumDesc'), icon: Zap },
                    { val: 'high',   label: t('scaleHigh'),   desc: t('scaleHighDesc'),   icon: CheckCircle },
                  ] as Array<{ val: Scale; label: string; desc: string; icon: LucideIcon }>).map(opt => {
                    const Icon = opt.icon
                    const isSelected = answers.scale === opt.val
                    return (
                      <button key={opt.val} onClick={() => handleSelect('scale', opt.val)}
                        className={`simulator-option-card flex items-center gap-4 p-5 rounded-xl text-left font-semibold text-sm cursor-pointer ${isSelected ? 'selected text-white' : 'text-neutral-300'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0 ${isSelected ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                          <span className="text-xs font-normal text-neutral-500 mt-0.5">{opt.desc}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Foco */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{t('step3Title')}</h3>
                <p className="text-sm text-neutral-400 mb-6">{t('step3Desc')}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {([
                    { val: 'cost',     label: t('focusCost'),     icon: DollarSign },
                    { val: 'latency',  label: t('focusLatency'),  icon: Zap },
                    { val: 'security', label: t('focusSecurity'), icon: Shield },
                  ] as Array<{ val: Focus; label: string; icon: LucideIcon }>).map(opt => {
                    const Icon = opt.icon
                    const isSelected = answers.focus === opt.val
                    return (
                      <button key={opt.val} onClick={() => handleSelect('focus', opt.val)}
                        className={`simulator-option-card flex flex-col items-start gap-3 p-5 rounded-xl text-left font-semibold text-sm cursor-pointer ${isSelected ? 'selected text-white' : 'text-neutral-300'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isSelected ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
                          <Icon size={20} />
                        </div>
                        <span>{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Budget + Team */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{t('step4Title')}</h3>
                  <p className="text-sm text-neutral-400 mb-6">{t('step4Desc')}</p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-neutral-500 mb-3 flex items-center gap-2">
                    <DollarSign size={13} className="text-orange-500" />
                    {t('step4Budget')}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { val: 'lean',       label: t('budgetLean') },
                      { val: 'growth',     label: t('budgetGrowth') },
                      { val: 'enterprise', label: t('budgetEnterprise') },
                    ] as Array<{ val: Budget; label: string }>).map(opt => {
                      const isSelected = answers.budget === opt.val
                      return (
                        <button key={opt.val} onClick={() => handleSelect('budget', opt.val)}
                          className={`simulator-option-card p-4 rounded-xl text-left text-xs sm:text-sm font-semibold cursor-pointer ${isSelected ? 'selected text-white' : 'text-neutral-300'}`}>
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-neutral-500 mb-3 flex items-center gap-2">
                    <Users size={13} className="text-orange-500" />
                    {t('step4Team')}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {([
                      { val: 'solo',   label: t('teamSolo') },
                      { val: 'small',  label: t('teamSmall') },
                      { val: 'medium', label: t('teamMedium') },
                      { val: 'large',  label: t('teamLarge') },
                    ] as Array<{ val: TeamSize; label: string }>).map(opt => {
                      const isSelected = answers.team === opt.val
                      return (
                        <button key={opt.val} onClick={() => handleSelect('team', opt.val)}
                          className={`simulator-option-card p-4 rounded-xl text-left text-xs font-semibold cursor-pointer ${isSelected ? 'selected text-white' : 'text-neutral-300'}`}>
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5 (resultado) */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }} className="flex flex-col gap-8">
                {/* Header com título + ações */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-emerald-400 mb-1">{t('resultTitle')}</div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{rec.title}</h3>
                      <p className="text-sm text-neutral-400 mt-1.5 max-w-[640px]">{rec.summary}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={copyMarkdown}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-all cursor-pointer">
                      <Copy size={12} />
                      <span>{copied ? t('btnCopied') : t('btnCopy')}</span>
                    </button>
                    <button onClick={downloadJson}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-all cursor-pointer">
                      <Download size={12} />
                      <span>{t('btnDownload')}</span>
                    </button>
                  </div>
                </div>

                {/* Métricas (4 KPIs) */}
                <SectionTitle icon={BarChart3} title={t('sectionMetrics')} />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 -mt-4">
                  <MetricCard label={t('labelCost')}    value={rec.metrics.costMonthly} accent="emerald" />
                  <MetricCard label={t('labelLatency')} value={rec.metrics.latencyP99}  accent="cyan" />
                  <MetricCard label={t('labelRps')}     value={rec.metrics.rps}         accent="amber" />
                  <MetricCard label={t('labelUptime')}  value={rec.metrics.uptime}      accent="violet" />
                </div>
                <div className="-mt-4 px-4 py-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs sm:text-sm">
                  <span className="font-bold text-orange-400">{t('labelPattern')}: </span>
                  <span className="text-neutral-200">{rec.metrics.pattern}</span>
                </div>

                {/* Diagrama de arquitetura */}
                <SectionTitle icon={LayersIcon} title={t('sectionDiagram')} />
                <ArchitectureDiagram rec={rec} t={(k: string) => t(k)} />

                {/* Stack detalhada */}
                <SectionTitle icon={Server} title={t('sectionStack')} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {rec.layers.map(layer => {
                    const meta = CATEGORY_META[layer.category]
                    const Icon = meta.icon
                    return (
                      <div key={layer.category} className="p-5 rounded-xl border border-neutral-800/80 bg-neutral-950/60 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400">
                            <Icon size={15} />
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">{meta.label}</span>
                        </div>
                        <div className="font-semibold text-sm text-white leading-snug">{layer.primary}</div>
                        <div className="text-xs leading-relaxed text-neutral-400">
                          <span className="text-orange-400 font-semibold">{t('sectionWhy')} </span>{layer.why}
                        </div>
                        {layer.alternatives.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-neutral-800/60 mt-1">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-600 font-bold mr-1 self-center">{t('alt')}:</span>
                            {layer.alternatives.map(a => (
                              <span key={a} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-900 text-neutral-400 border border-neutral-800">{a}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Time + Timeline lado a lado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Time */}
                  <div>
                    <SectionTitle icon={Users} title={t('sectionTeam')} />
                    <div className="flex flex-col gap-2 -mt-3">
                      {rec.team.map(role => (
                        <div key={role.role} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 flex-shrink-0 font-bold text-sm">
                            {role.count}×
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white">{role.role}</div>
                            <div className="text-xs text-neutral-400 leading-relaxed mt-0.5">{role.focus}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <SectionTitle icon={Clock} title={t('sectionTimeline')} />
                    <div className="relative -mt-3">
                      <div className="absolute left-[15px] top-1 bottom-1 w-[2px] bg-gradient-to-b from-orange-500 via-amber-500 to-red-500/30" />
                      <div className="flex flex-col gap-3">
                        {rec.timeline.map((p, i) => (
                          <div key={i} className="flex items-start gap-4 relative">
                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-neutral-900">
                              {i + 1}
                            </div>
                            <div className="flex-1 p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="text-sm font-semibold text-white truncate">{p.phase}</div>
                                <div className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/25 px-2 py-0.5 rounded-md flex-shrink-0">
                                  {p.weeks} {t('labelWeeks')}
                                </div>
                              </div>
                              <div className="text-xs text-neutral-400 leading-relaxed">{p.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center text-xs">
                        <span className="text-neutral-500">Total estimado: </span>
                        <span className="text-orange-400 font-bold">~{totalWeeks} {t('labelWeeks')} ({Math.round(totalWeeks / 4)} meses)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Riscos */}
                <SectionTitle icon={AlertTriangle} title={t('sectionRisks')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 -mt-4">
                  {rec.risks.map((r, i) => {
                    const sevMeta = {
                      low:    { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5',   label: t('severityLow') },
                      medium: { color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/5',     label: t('severityMedium') },
                      high:   { color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/5',       label: t('severityHigh') },
                    }[r.severity]
                    return (
                      <div key={i} className={`p-4 rounded-xl border ${sevMeta.border} ${sevMeta.bg}`}>
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="text-sm font-bold text-white leading-tight">{r.title}</div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${sevMeta.color} flex-shrink-0`}>{sevMeta.label}</span>
                        </div>
                        <div className="text-xs text-neutral-300 leading-relaxed">{r.desc}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href="#contato"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold text-sm no-underline bg-orange-600 hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    style={{ boxShadow: '0 4px 20px rgba(234, 88, 12, 0.3)' }}>
                    <Calendar size={16} />
                    <span>{t('btnTalk')}</span>
                  </a>
                  <button onClick={restart}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
                    <RotateCcw size={16} />
                    <span>{t('btnRestart')}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls (passos 1..4) */}
          {step <= STEPS && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-800/60">
              <button onClick={prevStep} disabled={step === 1}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                <ArrowLeft size={14} />
                <span>{t('btnBack')}</span>
              </button>

              <button onClick={nextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all cursor-pointer">
                <span>{step === STEPS ? 'Gerar Blueprint' : t('btnNext')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Helpers visuais ─────────── */

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="w-6 h-6 rounded-md bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
        <Icon size={12} />
      </div>
      <h4 className="text-[11px] uppercase tracking-[0.18em] font-bold text-white">{title}</h4>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-neutral-800 to-transparent ml-2" />
    </div>
  )
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: 'emerald' | 'cyan' | 'amber' | 'violet' }) {
  const accents: Record<typeof accent, string> = {
    emerald: 'text-emerald-400',
    cyan:    'text-cyan-400',
    amber:   'text-amber-400',
    violet:  'text-violet-400',
  }
  return (
    <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 leading-tight">{label}</span>
      <span className={`text-base sm:text-lg font-bold leading-tight ${accents[accent]}`}>{value}</span>
    </div>
  )
}

/* ─────────── Diagrama SVG ─────────── */

function ArchitectureDiagram({ rec, t }: { rec: Recommendation; t: (k: string) => string }) {
  const layerLabels: Record<string, string> = {
    user:  t('diagramUser'),
    edge:  t('diagramEdge'),
    app:   t('diagramApi'),
    queue: t('diagramQueue'),
    data:  t('diagramDb'),
    obs:   t('diagramObs'),
  }

  // Agrupa nodes por layer para renderização em grid horizontal por linha
  const ROWS = ['user', 'edge', 'app', 'queue', 'data', 'obs'] as const
  const grouped = ROWS.map(layer => ({
    layer,
    label: layerLabels[layer],
    nodes: rec.diagram.nodes.filter(n => n.layer === layer),
  })).filter(g => g.nodes.length > 0)

  return (
    <div className="-mt-3 p-3 sm:p-6 rounded-xl bg-gradient-to-br from-neutral-950 via-[#0b0a09] to-neutral-950 border border-neutral-800/80">
      <div className="flex flex-col gap-2 w-full min-w-0">
        {grouped.map((g, rowIdx) => (
          <div key={g.layer} className="min-w-0">
            {/* Label da camada (mobile) */}
            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-neutral-600 mb-1.5 sm:hidden">{g.label}</div>

            {/* Linha de boxes */}
            <div className="flex items-stretch gap-2 sm:gap-4 min-w-0">
              <div className="hidden sm:flex w-20 lg:w-24 flex-shrink-0 items-center">
                <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-neutral-600">{g.label}</span>
              </div>
              <div className="flex-1 flex flex-wrap gap-1.5 sm:gap-3 justify-center min-w-0">
                {g.nodes.map(node => (
                  <DiagramBox key={node.id} label={node.label} tech={node.tech} highlighted={node.layer === 'app'} />
                ))}
              </div>
            </div>

            {/* Connector entre linhas */}
            {rowIdx < grouped.length - 1 && (
              <div className="flex justify-center my-1.5">
                <div className="hidden sm:block w-20 lg:w-24" />
                <div className="flex-1 flex justify-center">
                  <svg width="22" height="22" viewBox="0 0 22 22" className="text-orange-500/60">
                    <line x1="11" y1="0" x2="11" y2="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
                    <polygon points="6,14 11,22 16,14" fill="currentColor" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legenda de edges */}
      <div className="mt-5 pt-4 border-t border-neutral-800/60">
        <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-neutral-600 mb-2">Conexões</div>
        <div className="flex flex-wrap gap-1.5">
          {rec.diagram.edges.map((e, i) => (
            <span key={i} className="text-[10px] font-mono px-2 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 inline-flex items-center max-w-full break-words">
              <span className="text-orange-400">{e.from}</span>
              <span className="mx-1 text-neutral-600">→</span>
              <span className="text-orange-400">{e.to}</span>
              {e.label && <span className="ml-1.5 text-neutral-500 hidden sm:inline">·  {e.label}</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function DiagramBox({ label, tech, highlighted }: { label: string; tech: string; highlighted?: boolean }) {
  return (
    <div className={`px-2.5 py-2 rounded-lg border min-w-[88px] sm:min-w-[140px] flex-1 sm:flex-none basis-[calc(50%-0.375rem)] sm:basis-auto max-w-full text-center transition-all ${
      highlighted
        ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_18px_rgba(234,88,12,0.15)]'
        : 'bg-neutral-900/60 border-neutral-800'
    }`}>
      <div className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-bold leading-tight ${highlighted ? 'text-orange-400' : 'text-neutral-500'}`}>{label}</div>
      <div className="text-[10px] sm:text-xs font-mono font-semibold text-white mt-0.5 leading-tight break-words">{tech}</div>
    </div>
  )
}
