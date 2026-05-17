'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

const AuthButton = () => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Link href="/login">
        <div className="min-w-[4.5rem] h-8 px-3 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold hover:opacity-80 normal-case">
          Entrar
        </div>
      </Link>
    )
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="min-w-[4.5rem] h-8 px-3 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold hover:opacity-80"
    >
      Sair
    </button>
  )
}

export default AuthButton
