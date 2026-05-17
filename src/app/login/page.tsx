'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { withAuthRedirect } from '@/app/hoc/withAuthRedirect'

const LoginPage = () => {
  return (
    <div className="page-fit p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      {/* BOX CONTAINER */}
      <div className="h-full shadow-2xl rounded-md flex flex-col md:flex-row md:h-[70%] md:w-full lg:w-[60%] 2xl:w-1/2">
        {/* IMAGE CONTAINER */}
        <div className="relative h-1/3 w-full md:h-full md:w-1/2">
          <Image
            src="/loginBg.png"
            alt="Fundo do login"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        {/* FORM CONTAINER */}
        <div className="p-10 flex flex-col gap-8 md:w-1/2">
          <h1 className="font-bold text-xl xl:text-3xl">Entrar</h1>
          <p className="mb-6 text-gray-700">Acesse sua conta ou crie uma nova usando as opções abaixo.</p>

          {/* GOOGLE SIGN IN */}
          <button
            className="flex gap-4 p-2 px-4 ring-1 ring-orange-100 rounded-md"
            onClick={() => signIn('google')}
          >
            <Image src="/google.png" alt="Google" width={20} height={20} className="object-contain" />
            <span>Entrar com Google</span>
          </button>

          {/* FACEBOOK SIGN IN */}
          <button className="flex gap-4 p-2 px-4 ring-1 ring-blue-100 rounded-md">
            <Image src="/facebook.png" alt="Facebook" width={20} height={20} className="object-contain" />
            <span>Entrar com Facebook</span>
          </button>

          <p className="text-sm">
            Teve algum problema? <Link href="/" className="underline">Fale conosco</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default withAuthRedirect(LoginPage)
