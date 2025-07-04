import React from 'react'
import Menu from '@/components/Menu'
import Link from 'next/link'
import CartIcon from './CartIcon'
import Image from 'next/image'
import AuthButton from './AuthButton'



const Navbar = () => {
  return (
    <div className="h-12 p-4 text-red-500 flex justify-between items-center bg-white border-b-2 border-b-red-500 uppercase">
        {/* LEFT LINKS */}
        <div className='hidden md:flex gap-4 flex flex-1'>
            <Link href="/">Home</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/">Contact</Link>
        </div>

        { /* LOGO */}
        <div className='text-xl md:font-bold flex-1 md:text-center'>
            <Link href="/">Massimo</Link>
        </div>

        { /* MOBILE MENU */}
        <div className='md:hidden flex items-center gap-4'>
            <Menu />
        </div>

    {/* RIGHT LINKS */}
    <div className='hidden md:flex gap-4 items-start justify-end flex-1'>
        <div className='md:absolute h-8 top-3 right-2 lg:static flex items-center gap-3 cursor-pointer bg-red-500 px-2 rounded-full'>
            <Image src='/phone.png' alt='Phone Icon' width={20} height={20} />
            <span className='text-white'>(19) 999999999</span>
        </div>

         <AuthButton />


        <Link href="/cart"><CartIcon /></Link>
    </div>
    </div>
  )
}

export default Navbar
