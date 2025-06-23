import React from 'react'
import Menu from '@/components/Menu'
import Link from 'next/link'
import CartIcon from './CartIcon'
import Image from 'next/image'

const Navbar = () => {
    const user = false;

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
    <div className='hidden md:flex gap-4 items-center justify-end flex-1'>
        <div className='md:absolute top-3 right-2 lg:static flex items-center gap-2 cursor-pointer bg-orange-300 px-1 rounded-md'>
            <Image src='/phone.png' alt='Phone Icon' width={20} height={20} />
            <span>(19) 999999999</span>
        </div>
        {!user ? (<Link href="/login">Login</Link>) : (<Link href="/orders">Orders</Link>)}
        <Link href="/cart"><CartIcon /></Link>
    </div>
    </div>
  )
}

export default Navbar
