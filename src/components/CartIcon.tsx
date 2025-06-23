import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const CartIcon = () => {
  return (
    <div className="flex items-center gap-2 bg-white px-2 py-1 h-8 rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer ring-1 ring-red-200 hover:ring-red-400">
      {/* <div className="relative w-6 h-6 md:w-5 md:h-5">
        <Image
          src="/cart.png"
          alt="Cart Icon"
          fill
          className="object-contain"
        />
      </div> */}
      <span className="text-xs font-semibold text-red-500">🛒 Cart (3)</span>
    </div>
  );
};


export default CartIcon
