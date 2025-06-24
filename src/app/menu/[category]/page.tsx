import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductType } from '@app/types/types';


const getData = async (category: string): Promise<ProductType[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?cat=${category}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();

  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

type Props = {  params: {
    category: string;
  } };

const CategoryPage = async ({params}: Props) => {
  const products: ProductType[] = await getData(params.category);

  if (products.length === 0) {
    return <div className='page-fit flex items-center justify-center text-red-500 text-center my-4'>No products found</div>;
  }

  return (
    <div className='flex flex-wrap text-red-500 '>
      {products.map((item) => (
        <Link className='w-full h-[60vh] border-r-2 border-b-2 border-red-500 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-fuchsia-50' href={`/product/${item.id}`} key={item.id}>
          {/* Image Container */}
          {item.img && (
            <div className='relative h-[80%]'>
              <Image
                className='object-contain transform hover:scale-105 transition-all duration-300 ease-in-out'
                src={item.img}
                alt={item.title}
                fill
              />
            </div>
          )}
          {/* Text Container */}
          <div className='flex items-center justify-between font-bold'>
            <h1 className='group-hover:text-sm text-2xl uppercase p-2'>{item.title}</h1>
            <h2 className='group-hover:hidden text-xl'>${item.price}</h2>
            <button className='hidden group-hover:block uppercase bg-red-500 text-white p-2 rounded-md'>Add to Cart</button>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default CategoryPage;

