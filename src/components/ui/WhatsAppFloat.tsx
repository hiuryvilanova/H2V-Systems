'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { WHATSAPP_LINK } from '@/lib/constants'

export default function WhatsAppFloat() {
  const t       = useTranslations('Whatsapp')
  const [hovered, setHovered] = useState(false)

  const message = t('message')
  const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed z-[9999] w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full
        flex items-center justify-center animate-float hover:scale-110 transition-transform duration-300
        whatsapp-float-pos"
      style={{
        background: 'linear-gradient(135deg, #25d366, #128c7e)',
        boxShadow: '0 4px 24px rgba(37, 211, 102, 0.5)',
      }}
    >
      {/* Outer pulsing rings */}
      <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
      <span className="absolute inset-0 rounded-full bg-[#128c7e] opacity-20 animate-ping pointer-events-none" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />

      <span
        className="hidden sm:block absolute left-[72px] whitespace-nowrap text-white text-[0.82rem] font-medium px-3 py-2 rounded-lg transition-opacity duration-300"
        style={{ background: 'rgba(18,140,126,0.92)', backdropFilter: 'blur(8px)', opacity: hovered ? 1 : 0, pointerEvents: 'none' }}
      >
        {t('tooltip')}
      </span>
      <WhatsAppIcon size={26} color="white" className="sm:w-7 sm:h-7 relative z-10" />
    </a>
  )
}
