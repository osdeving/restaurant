"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const data = [
  {
    id: 1,
    title: 'alwayes fresh & always crispy & always hot',
    image: '/slide1.png',
  },
  {
    id: 2,
    title: 'we deliver your order wherever you are in NY',
    image: '/slide2.png',
  },
  {
    id: 3,
    title: 'the best pizza to share with your family',
    image: '/slide3.jpg',
  },
];

const Slider = () => {
  const [currentSlide] = useState(2);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row bg-fuchsia-50">
      {/* TEXT CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 text-red-500 font-bold">
        <h1 className="text-5xl text-center uppercase p-4 md:p-10 md:text-6xl xl:text-7xl">
          {data[currentSlide].title}
        </h1>
        <button className="bg-red-500 text-white py-4 px-8">Order Now</button>
      </div>
      {/* IMAGE CONTAINER */}
      <div className="flex-1 w-full relative">
        <Image
          src={data[currentSlide].image}
          alt="Slider Image"
          fill
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Slider;
