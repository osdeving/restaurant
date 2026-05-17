import Link from 'next/link'
import React from 'react'
import { siteConfig } from '@/config/site'

const Footer = () => {
  return (
    <div className='min-h-12 px-4 py-3 lg:px-20 xl:px-40 text-red-700 bg-[#f4c624] flex flex-col gap-1 items-center justify-center text-center sm:flex-row sm:justify-between'>
        <Link href="/" className='text-xl font-black uppercase'>{siteConfig.name}</Link>
        <p className='text-sm sm:text-base'>&copy; Todos os direitos reservados</p>
    </div>
  )
}

export default Footer
