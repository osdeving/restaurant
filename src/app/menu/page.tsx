import React from 'react';
import Link from 'next/link';
import { MenuType } from '@/app/types/types';

const getData = async (): Promise<MenuType> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }

    return res.json();

  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

const MenuPage = async () => {
  const menu = await getData();
  return (
    <div className="page-fit p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center">
      {menu.map((item) => (
        <Link
            href={`/menu/${item.slug}`}
            key={item.id}
            className="w-full h-1/3 bg-cover p-8 md:h-1/2"
            style={{ backgroundImage: `url(${item.img})` }}
          >
          <div className={`text-${item.color} w-1/2`}>
            <h1 className='uppercase font-bold text-3xl'>{item.title}</h1>
            <p className='text-sm my-8'>{item.desc}</p>
            <button className={`hidden 2xl:block bg-${item.color} text-${item.color === 'black' ? 'white' : 'red-500'} py-2 px-4 rounded-md`}>Explore</button>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default MenuPage;
