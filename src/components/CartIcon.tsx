import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const CartIcon = () => {
  return (
    <div className="flex items-center gap-4">
        <div className="relative w-8 h-8 md:w-5 md:h-5">
            <Image
              src="/cart.png"
              alt="Cart Icon"
              fill
            />
        </div>
        <span>Cart (3)</span>

    </div>
  )
}

export default CartIcon
