import React from 'react'
import Image from 'next/image'
import Link from 'next/dist/client/link'

const LoginPage = () => {
  return (
    <div className="page-fit p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      {/* BOX CONTAINER */}
      <div className="h-full shadow-2xl rounded-md flex flex-col md:flex-row md:h-[70%] md:w-full lg:w-[60%] 2xl:w-1/2">
        {/* IMAGE CONTAINER */}
        <div className="relative h-1/3 w-full md:h-full md:w-1/2">
          <Image
            src="/loginBg.png"
            alt="Login Background"
            fill
            className="object-cover"
          />
        </div>
        {/* FORM CONTAINER */}
        <div className="p-10 flex flex-col gap-8 md:w-1/2">
          <h1 className="font-bold text-xl xl:text-3xl">Welcome</h1>
          <p className="mb-6 text-gray-700">Log into your account or create a new one using social buttons</p>

          {/* GOOGLE SIGN IN */}
          <button className="flex gap-4 p-2 px-4 ring-1 ring-orange-100 rounded-md">
            <Image src="/google.png" alt="Google" width={20} height={20} className='object-contain' />
            <span>Sign in with Google</span>
          </button>

          {/* FACEBOOK SIGN IN */}
          <button className="flex gap-4 p-2 px-4 ring-1 ring-blue-100 rounded-md">
            <Image src="/facebook.png" alt="Facebook" width={20} height={20} className='object-contain' />
            <span>Sign in with Facebook</span>
          </button>

          <p className="text-sm">
            Have a problem? <Link href="/" className="underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
