import Image from 'next/image'
import React from 'react'


const CartIcon = () => {
  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1 h-8 rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer ring-1 ring-red-200 hover:ring-red-400">
      <div className="relative w-5 h-5">
        <Image
          src="/cart.png"
          alt="Carrinho"
          fill
          sizes="20px"
          className="object-contain"
        />
      </div>
      <span className="text-xs font-semibold text-red-600 whitespace-nowrap">Carrinho (3)</span>
    </div>
  );
};


export default CartIcon
