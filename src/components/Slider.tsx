"use client";

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

const Slider = () => {
  return (
    <section className="relative isolate min-h-[calc(100vh-6.5rem)] overflow-hidden bg-[#f4c624] px-4 py-8 md:px-10 lg:px-20 xl:px-40">
      <div className="absolute -right-24 top-8 -z-10 h-[34rem] w-[34rem] rounded-[44%_56%_50%_50%] bg-red-600 md:right-12 md:h-[40rem] md:w-[40rem] lg:right-0 lg:w-[62rem]" />

      <div className="flex min-h-[calc(100vh-12rem)] flex-col-reverse items-center justify-center gap-8 lg:flex-row">
        <div className="relative h-[18rem] w-full max-w-[34rem] flex-1 md:h-[28rem] lg:h-[34rem]">
          <Image
            src="/temporary/p4.png"
            alt="Prato-feito"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain drop-shadow-2xl"
          />
        </div>

        <div className="flex flex-1 flex-col items-center gap-5 text-center text-white lg:items-start lg:text-left">
          <p className="text-4xl font-black uppercase leading-none sm:text-5xl md:text-7xl xl:text-8xl">
            {siteConfig.name}
          </p>
          <h1 className="max-w-xl text-3xl font-black uppercase leading-tight sm:text-4xl md:text-5xl xl:text-6xl">
            Marmitex Prato-Feito
          </h1>
          <p className="max-w-lg text-base font-bold text-white md:text-xl">
            Almoço caseiro bem servido, feito no capricho para retirar ou receber.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={siteConfig.whatsappHref}
              className="rounded-full bg-red-700 px-6 py-4 text-lg font-black text-[#f4c624] shadow-xl"
            >
              WhatsApp {siteConfig.phone}
            </a>
            <Link
              href="/menu"
              className="rounded-full bg-white px-6 py-4 text-lg font-black text-red-700 shadow-xl"
            >
              Ver cardápio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slider;
