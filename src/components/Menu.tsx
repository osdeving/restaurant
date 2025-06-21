'use client';

import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next//link';
import CartIcon from './CartIcon';

const links = [
    { id: 1, title: 'Home', url: '/' },
    { id: 2, title: 'Menu', url: '/' },
    { id: 3, title: 'Working hours', url: '/' },
    { id: 4, title: 'Contact', url: '/' },
];

const Menu = () => {
    const [open, setOpen] = useState(false);

    // temporary variable to simulate user login state
    const users = false;
  return (
    <div>
        {!open ? (
        <Image
            src="/open.png"
            alt="Menu Image"
            width={20}
            height={20}

            onClick={() => setOpen(true)}

        />
        ) : (
        <Image
            src="/close.png"
            alt="Menu Image"
            width={20}
            height={20}
            onClick={() => setOpen(false)}
        />
        )}
        {open && (
        <div className='absolute top-24 left-0 h-[calc(100vh-6rem)] w-full bg-red-500 text-white flex items-center justify-center gap-8 text-3xl flex-col z-10'>
            {links.map((link) => (
                <Link key={link.id} href={link.url} className="block p-4 text-center text-white" onClick={() => setOpen(false)}>
                    {link.title}
                </Link>
            ))}
            {users ? (
                <Link href="/profile" className="block p-4 text-center text-white hover:bg-white" onClick={() => setOpen(false)}>
                    Profile
                </Link>
            ) : (
                <Link href="/login" className="block p-4 text-center text-white hover:bg-white" onClick={() => setOpen(false)}>
                    Login
                </Link>
            )}
            <Link href="/cart" onClick={() => setOpen(false)}>
                <CartIcon />
            </Link>
        </div>
        )}
    </div>
  )
}

export default Menu
