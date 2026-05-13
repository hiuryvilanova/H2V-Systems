export default function GlowDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: '1px',
        background:
          'linear-gradient(90deg, transparent, var(--cyan), var(--blue), var(--cyan), transparent)',
        opacity: 0.3,
      }}
    />
  )
}
