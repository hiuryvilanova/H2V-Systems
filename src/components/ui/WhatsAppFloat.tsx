'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { WHATSAPP_LINK } from '@/lib/constants'

export default function WhatsAppFloat() {
  const t       = useTranslations('Whatsapp')
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[9999] w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full
        flex items-center justify-center animate-float hover:scale-110 transition-transform duration-300"
      style={{
        background: 'linear-gradient(135deg, #25d366, #128c7e)',
        boxShadow: '0 4px 24px rgba(37, 211, 102, 0.5)',
      }}
    >
      <span
        className="hidden sm:block absolute right-[72px] whitespace-nowrap text-white text-[0.82rem] font-medium px-3 py-2 rounded-lg transition-opacity duration-300"
        style={{ background: 'rgba(18,140,126,0.92)', backdropFilter: 'blur(8px)', opacity: hovered ? 1 : 0, pointerEvents: 'none' }}
      >
        {t('tooltip')}
      </span>
      <WhatsAppIcon size={26} color="white" className="sm:w-7 sm:h-7" />
    </a>
  )
}
