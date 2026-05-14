export default function GlowDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(15,23,42,0.12), transparent)',
        opacity: 1,
      }}
    />
  )
}
