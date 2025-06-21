import React from 'react'
import Image from 'next/image';
import CountDown from './CountDown';

const Offer = () => {
  return (
    <div>
      {/* Offer Section */}
      { /* bg-[url('/offerBg.png')] bg-cover bg-center border-b-2 border-red-500 p-6 md:p-12 lg:p-16 xl:p-20 2xl:p-24 */ }
      <div className="bg-black h-screen flex flex-col md:flex-row md:justify-between bg-[url('/offerBg.png')] md:h-[70vh]">

        {/* TEXT CONTAINER */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 p-6">
          <h1 className="text-white font-bold text-5xl xl:text-6xl">Delicious Burger & French Fry</h1>
          <p className="text-white xl:text-xl ">
            Progresively simplify effective e-toilers and proces-centric methods
            of empowerment. Quickly pontificate parallel.
          </p>
          <CountDown/>
          <button className=" bg-red-500 text-white px-6 py-3 rounded:md ">Order Now</button>
        </div>

        {/* IMAGE CONTAINER */}
        <div className="flex-1 w-full relative md:h-full">
          <Image src="/offerProduct.png" alt="Special Offer" fill className="object-contain"/>
        </div>
      </div>
    </div>
  )
}

export default Offer
