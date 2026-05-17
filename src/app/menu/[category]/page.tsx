import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductType } from '@app/types/types';
import { formatCurrency } from '@/config/site';
import { productsByCategory } from '@/data';


const getData = async (category: string): Promise<ProductType[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?cat=${category}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar produtos');
    }

    const products = await res.json();
    return products.length ? products : productsByCategory[category] ?? [];

  } catch {
    return productsByCategory[category] ?? [];
  }
}

type Props = {  params: Promise<{
    category: string;
  }> };

const CategoryPage = async ({params}: Props) => {
  const { category } = await params;
  const products: ProductType[] = await getData(category);

  if (products.length === 0) {
    return <div className='page-fit flex items-center justify-center text-red-600 text-center my-4'>Nenhum produto encontrado</div>;
  }

  return (
    <div className='flex flex-wrap text-red-600 bg-white'>
      {products.map((item) => (
        <Link className='w-full h-[60vh] border-r-2 border-b-2 border-red-600 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-[#fff4c7]' href={`/product/${item.id}`} key={item.id}>
          {/* Image Container */}
          {item.img && (
            <div className='relative h-[80%]'>
              <Image
                className='object-contain transform hover:scale-105 transition-all duration-300 ease-in-out'
                src={item.img}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          )}
          {/* Text Container */}
          <div className='flex items-center justify-between font-bold'>
            <h1 className='group-hover:text-sm text-2xl uppercase p-2'>{item.title}</h1>
            <h2 className='group-hover:hidden text-xl'>{formatCurrency(item.price)}</h2>
            <button className='hidden group-hover:block uppercase bg-red-600 text-white p-2 rounded-md'>Adicionar</button>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default CategoryPage;
