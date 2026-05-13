import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'H2V Systems'

export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #0d0a08 0%, #1c1710 50%, #231d14 100%)',
          color: '#FAF0E8',
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 50% 40% at 70% 30%, rgba(232,75,26,0.35) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(191,56,8,0.18) 0%, transparent 50%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #E84B1A, #BF3808)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 900,
              color: 'white',
              boxShadow: '0 8px 32px rgba(232,75,26,0.45)',
            }}
          >
            H
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              H<span style={{ color: '#E84B1A' }}>2</span>V Systems
            </div>
            <div style={{ fontSize: '18px', color: '#A89880', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Tecnologia de Precisão
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          <div
            style={{
              fontSize: '76px',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              maxWidth: '900px',
            }}
          >
            {t('title').split('|')[0].trim()}
          </div>
          <div style={{ fontSize: '24px', color: '#A89880', lineHeight: 1.5, maxWidth: '900px' }}>
            {t('description').slice(0, 140)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['Java', 'Kotlin', 'Spring', 'AWS', 'React', 'Node.js'].map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  padding: '8px 18px',
                  borderRadius: '100px',
                  background: 'rgba(232,75,26,0.13)',
                  border: '1px solid rgba(232,75,26,0.44)',
                  color: '#E84B1A',
                  fontSize: '18px',
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '20px', color: '#5E5048' }}>h2vsystems.com.br</div>
        </div>
      </div>
    ),
    size,
  )
}
