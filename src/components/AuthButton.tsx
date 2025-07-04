'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

const AuthButton = () => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Link href="/login">
        <div className="w-18 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold hover:opacity-80 normal-case">
          Login
        </div>
      </Link>
    )
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="w-18 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold hover:opacity-80"
    >
      Logout
    </button>
  )
}

export default AuthButton
