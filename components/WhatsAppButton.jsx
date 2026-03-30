'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function WhatsAppButton() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || '5582999646622'
  const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços de Elo Boost.')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <Button
      asChild
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-transparent hover:scale-110 shadow-lg hover:shadow-xl transition-all z-50 animate-glow-pulse p-0 border-0"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Image
          src="https://customer-assets.emergentagent.com/job_velocity-boost-7/artifacts/zm5l1lac_image.png"
          alt="WhatsApp"
          width={64}
          height={64}
          className="rounded-full"
        />
      </a>
    </Button>
  )
}