export default function GlowDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(234, 88, 12, 0.15), transparent)',
        opacity: 1,
      }}
    />
  )
}
