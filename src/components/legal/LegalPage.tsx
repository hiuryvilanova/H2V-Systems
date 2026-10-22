import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProgressBar from '@/components/ui/ProgressBar'
import BackToTop from '@/components/ui/BackToTop'
import { getLegalDocument, type LegalDocId } from '@/lib/legal-content'
import { Link } from '@/i18n/navigation'

type Props = {
  locale: string
  docId: LegalDocId
}

export default function LegalPage({ locale, docId }: Props) {
  const doc = getLegalDocument(docId, locale)

  return (
    <>
      <ProgressBar />
      <Navbar />
      <main id="main" tabIndex={-1} className="w-full min-w-0">
        <article className="relative pt-[120px] sm:pt-[140px] pb-16 sm:pb-24">
          <div className="max-w-[760px] mx-auto px-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-3">
              H2V Systems
            </p>
            <h1 className="text-[clamp(1.75rem,4.5vw,2.6rem)] font-bold tracking-tight leading-[1.15] text-white mb-3">
              {doc.title}
            </h1>
            <p className="text-sm text-neutral-300 mb-8">{doc.updatedLabel}</p>
            <p className="text-base leading-relaxed text-neutral-200 mb-4">{doc.intro}</p>
            <p className="text-sm leading-relaxed text-neutral-300 border-l-2 border-orange-500/40 pl-4 mb-10">
              {doc.disclaimer}
            </p>

            <div className="flex flex-wrap gap-3 mb-12 text-sm">
              <Link href="/legal/privacidade" className="text-orange-400 hover:text-orange-300 no-underline underline-offset-2 hover:underline">
                {locale === 'en' ? 'Privacy' : locale === 'es' ? 'Privacidad' : 'Privacidade'}
              </Link>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <Link href="/legal/termos" className="text-orange-400 hover:text-orange-300 no-underline underline-offset-2 hover:underline">
                {locale === 'en' ? 'Terms' : locale === 'es' ? 'Términos' : 'Termos'}
              </Link>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <Link href="/legal/reembolso" className="text-orange-400 hover:text-orange-300 no-underline underline-offset-2 hover:underline">
                {locale === 'en' ? 'Refunds' : locale === 'es' ? 'Reembolsos' : 'Reembolso'}
              </Link>
            </div>

            {doc.sections.map((section) => (
              <section key={section.heading} className="mb-10">
                <h2 className="text-lg font-semibold text-white mb-3">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)} className="text-[0.95rem] leading-[1.75] text-neutral-200 mb-3">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
