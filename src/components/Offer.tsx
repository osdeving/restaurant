import React from 'react'
import Image from 'next/image';
import CountDown from './CountDown';
import { siteConfig } from '@/config/site';

const Offer = () => {
  return (
    <div>
      {/* Offer Section */}
      { /* bg-[url('/offerBg.png')] bg-cover bg-center border-b-2 border-red-500 p-6 md:p-12 lg:p-16 xl:p-20 2xl:p-24 */ }
      <div className="bg-red-600 min-h-screen flex flex-col md:flex-row md:justify-between md:min-h-[70vh]">

        {/* TEXT CONTAINER */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 p-6">
          <p className="text-[#f4c624] font-black uppercase text-xl">Oferta do dia</p>
          <h1 className="text-white font-black uppercase text-5xl xl:text-6xl">Marmitex completa</h1>
          <p className="text-white xl:text-xl max-w-xl">
            Arroz, feijão, farofa, salada e proteína do dia com preço especial no almoço.
          </p>
          <span className="text-white font-bold">Termina em</span>
          <CountDown/>
          <a href={siteConfig.whatsappHref} className="bg-[#f4c624] text-red-700 px-6 py-3 rounded-full font-black">Pedir agora</a>
        </div>

        {/* IMAGE CONTAINER */}
        <div className="flex-1 w-full relative min-h-[18rem] md:h-full">
          <Image
            src="/temporary/p10.png"
            alt="Marmitex em oferta"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-6"
          />
        </div>
      </div>
    </div>
  )
}

export default Offer
