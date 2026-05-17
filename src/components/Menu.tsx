'use client';

import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import CartIcon from './CartIcon';
import { siteConfig } from '@/config/site';

const links = [
    { id: 1, title: 'Início', url: '/' },
    { id: 2, title: 'Menu', url: '/menu' },
    { id: 3, title: 'Créditos', url: '/creditos' },
    { id: 4, title: 'Horários', url: '/' },
    { id: 5, title: 'Contato', url: siteConfig.whatsappHref, external: true },
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
            alt="Abrir menu"
            width={20}
            height={20}

            onClick={() => setOpen(true)}

        />
        ) : (
        <Image
            src="/close.png"
            alt="Fechar menu"
            width={20}
            height={20}
            onClick={() => setOpen(false)}
        />
        )}
        {open && (
        <div className='absolute top-[6.5rem] left-0 h-[calc(100vh-6.5rem)] w-full bg-red-600 text-white flex items-center justify-center gap-8 text-3xl flex-col z-10'>
            {links.map((link) => (
                link.external ? (
                    <a key={link.id} href={link.url} className="block p-4 text-center text-white" onClick={() => setOpen(false)}>
                        {link.title}
                    </a>
                ) : (
                    <Link key={link.id} href={link.url} className="block p-4 text-center text-white" onClick={() => setOpen(false)}>
                        {link.title}
                    </Link>
                )
            ))}
            {users ? (
                <Link href="/profile" className="block p-4 text-center text-white hover:bg-white" onClick={() => setOpen(false)}>
                    Perfil
                </Link>
            ) : (
                <Link href="/login" className="block p-4 text-center text-white hover:bg-white" onClick={() => setOpen(false)}>
                    Entrar
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
