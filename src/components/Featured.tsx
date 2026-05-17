import React from 'react'
import Image from 'next/image';
import { ProductType } from '../app/types/types';
import { featuredProducts as fallbackProducts } from '@/data';
import { formatCurrency } from '@/config/site';


const getData = async (): Promise<ProductType[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar produtos');
    }

    const products = await res.json();
    return products.length ? products : fallbackProducts;

  } catch {
    return fallbackProducts;
  }
}

const Featured = async () => {
    const featuredProducts: ProductType[] = await getData();

  return (
    <div className="w-screen overflow-x-scroll text-red-600 bg-white">

        {/* WRAPPER */}
        <div className="w-max flex">

            {/* SINGLE ITEM */}
            {featuredProducts.map((item) => (
                <div
                    key={item.id}
                    className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 hover:bg-[#fff4c7] transition-all duration-100 ease-in-out md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
                >

                    {/* IMAGE CONTAINER */}
                    {item.img &&(
                        <div className="relative flex-1 w-full hover:rotate-[60deg] transition-all duration-100 ease-in-out">
                            <Image
                                src={item.img}
                                alt={item.title}
                                className="object-contain"
                                fill
                                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                            />
                        </div>
                    )}

                    {/* TEXT CONTAINER */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                        <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">{item.title}</h1>
                        <p className="p-4">{item.desc}</p>
                        <span className="text-xl font-bold">{formatCurrency(item.price)}</span>
                        <button className="bg-red-600 text-white p-2 rounded-md font-bold">Adicionar ao carrinho</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Featured
