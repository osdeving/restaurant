import React from 'react';
import Link from 'next/link';
import { MenuType } from '@/app/types/types';
import { menu as fallbackMenu } from '@/data';

const getData = async (): Promise<MenuType> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar categorias');
    }

    const categories = await res.json();
    return categories.length ? categories : fallbackMenu;

  } catch {
    return fallbackMenu;
  }
}

const MenuPage = async () => {
  const menu = await getData();
  return (
    <div className="page-fit p-4 lg:px-20 xl:px-40 h-[calc(100vh-6.5rem)] flex flex-col md:flex-row items-center gap-4 bg-[#f4c624]">
      {menu.map((item) => (
        <Link
            href={`/menu/${item.slug}`}
            key={item.id}
            className="w-full h-1/3 bg-cover bg-center p-8 md:h-1/2 rounded-md shadow-lg overflow-hidden"
            style={{ backgroundImage: `url(${item.img})` }}
          >
          <div className={`${item.color === 'black' ? 'text-neutral-950' : 'text-white'} w-2/3`}>
            <h1 className='uppercase font-bold text-3xl'>{item.title}</h1>
            <p className='text-sm my-8'>{item.desc}</p>
            <button className="hidden 2xl:block bg-red-600 text-white py-2 px-4 rounded-md font-bold">Ver opções</button>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default MenuPage;
