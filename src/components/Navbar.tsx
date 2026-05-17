import React from 'react'
import Menu from '@/components/Menu'
import Link from 'next/link'
import CartIcon from './CartIcon'
import Image from 'next/image'
import AuthButton from './AuthButton'
import { siteConfig } from '@/config/site'



const Navbar = () => {
  return (
    <div className="h-14 px-4 lg:px-12 xl:px-28 text-red-700 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] gap-4 items-center bg-[#f4c624] border-b-4 border-b-red-600 uppercase">
        {/* LEFT LINKS */}
        <div className='hidden md:flex gap-4 font-bold min-w-0'>
            <Link href="/">Início</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/creditos">Créditos</Link>
            <a href={siteConfig.whatsappHref}>Contato</a>
        </div>

        { /* LOGO */}
        <div className='md:text-center leading-none min-w-max'>
            <Link href="/" className='text-xl md:text-2xl font-black'>{siteConfig.name}</Link>
            <p className='hidden md:block text-[10px] font-bold text-red-800 normal-case'>{siteConfig.specialty}</p>
        </div>

        { /* MOBILE MENU */}
        <div className='md:hidden flex items-center gap-4'>
            <Menu />
        </div>

    {/* RIGHT LINKS */}
    <div className='hidden md:flex gap-2 lg:gap-4 items-center justify-end min-w-0'>
        <a href={siteConfig.whatsappHref} className='hidden xl:inline-flex h-9 flex-none min-w-max items-center gap-3 bg-red-600 px-5 rounded-full shadow-md'>
            <Image src='/phone.png' alt='Telefone' width={20} height={20} />
            <span className='text-white font-bold whitespace-nowrap'>{siteConfig.phone}</span>
        </a>

         <AuthButton />


        <Link href="/cart"><CartIcon /></Link>
    </div>
    </div>
  )
}

export default Navbar
