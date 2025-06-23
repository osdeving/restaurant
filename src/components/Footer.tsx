import Link from 'next/dist/client/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='h-12 px-4 lg:px-20 xl:px-40 text-red-500 flex items-center justify-between [@media(max-width:320px)]:justify-center'>
        <Link href="/" className='text-xl font-bold'>MASSIMO</Link>
        <p className='[@media(max-width:320px)]:hidden'>&copy; ALL RIGHTS RESERVED</p>
    </div>
  )
}

export default Footer
