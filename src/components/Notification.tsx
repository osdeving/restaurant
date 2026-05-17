import { siteConfig } from '@/config/site'
import React from 'react'

const Notification = () => {
  return (
    <div className='h-12 bg-red-600 text-white px-4 flex items-center justify-center text-center text-sm md:text-base cursor-pointer font-bold'>
      Entrega grátis nos pedidos acima de R$ 50. Peça pelo WhatsApp {siteConfig.phone}
    </div>
  )
}

export default Notification
