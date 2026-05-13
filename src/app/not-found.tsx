import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <html lang="pt">
      <body style={{ background: '#0d0a08', color: '#FAF0E8', margin: 0, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `
              radial-gradient(ellipse 60% 50% at 50% 40%, rgba(232,75,26,0.18) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 80% 70%, rgba(191,56,8,0.10) 0%, transparent 50%)
            `, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '480px' }}>
            <Image src="/logo.png" alt="H2V Systems" width={64} height={64} style={{ margin: '0 auto 24px', borderRadius: '12px' }} />

            <h1 style={{ fontSize: 'clamp(4.5rem, 14vw, 8rem)', fontWeight: 900, margin: 0, lineHeight: 1,
                background: 'linear-gradient(90deg, #FF6B35, #E84B1A, #BF3808)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              404
            </h1>

            <p style={{ fontFamily: 'monospace', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#E84B1A', margin: '8px 0 16px' }}>
              // Página não encontrada
            </p>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>
              Esta rota não existe
            </h2>

            <p style={{ fontSize: '0.95rem', color: '#A89880', lineHeight: 1.7, margin: '0 0 32px' }}>
              A página que você procura foi movida, removida ou nunca existiu. Sem stress, é só voltar para a home.
            </p>

            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
              color: 'white', fontWeight: 600, fontSize: '0.9rem',
              background: 'linear-gradient(135deg, #E84B1A, #BF3808)',
              boxShadow: '0 4px 24px rgba(232,75,26,0.45)',
            }}>
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
