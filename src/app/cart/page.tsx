import React from 'react'
import Image from 'next/image';

function CartPage() {
  return (
    <div className='page-fit flex flex-col text-red-500 lg:flex-row border '>
      {/* PRODUCTS CONTAINER */}
      <div className='h-1/2 p-4 flex flex-col justify-start overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 2xl:text-xl 2xl:gap-6'>

        {/* SINGLE ITEM */}
        <div className='flex items-center justify-between m-2'>
            <Image src='/temporary/p1.png' alt='Product Image' width={100} height={100} className='object-contain  [@media(max-width:320px)]:hidden' />
            <div className='flex flex-col items-start min-w-[100px]'>
              <h1 className='uppercase md:text-xl font-bold'>Pizza</h1>
              <span>Large</span>
            </div>
            <h2 className='font-bold'>$79.90</h2>
            <span className='cursor-pointer'>X</span>
        </div>

        {/* SINGLE ITEM */}
        <div className='flex items-center justify-between m-2'>
            <Image src='/temporary/p1.png' alt='Product Image' width={100} height={100} className='object-contain  [@media(max-width:320px)]:hidden' />
            <div className='flex flex-col items-start min-w-[100px]'>
              <h1 className='uppercase md:text-xl font-bold'>Pizza</h1>
              <span>Large</span>
            </div>
            <h2 className='font-bold'>$79.90</h2>
            <span className='cursor-pointer'>X</span>
        </div>

        {/* SINGLE ITEM */}
        <div className='flex items-center justify-between m-2'>
            <Image src='/temporary/p1.png' alt='Product Image' width={100} height={100} className='object-contain  [@media(max-width:320px)]:hidden' />
            <div className='flex flex-col items-start min-w-[100px]'>
              <h1 className='uppercase md:text-xl font-bold'>Pizza</h1>
              <span>Large</span>
            </div>
            <h2 className='font-bold'>$79.90</h2>
            <span className='cursor-pointer'>X</span>
        </div>

        {/* SINGLE ITEM */}
        <div className='flex items-center justify-between m-2'>
            <Image src='/temporary/p2.png' alt='Product Image' width={100} height={100} className='object-contain  [@media(max-width:320px)]:hidden' />
            <div className='flex flex-col items-start min-w-[100px]'>
              <h1 className='uppercase md:text-xl font-bold'>Hamburger</h1>
              <span>Medium</span>
            </div>
            <h2 className='font-bold'>$29.90</h2>
            <span className='cursor-pointer'>X</span>
        </div>

        {/* SINGLE ITEM */}
        <div className='flex items-center justify-between m-2'>
            <Image src='/temporary/p7.png' alt='Product Image' width={100} height={100} className='object-contain  [@media(max-width:320px)]:hidden' />
            <div className='flex flex-col items-start min-w-[100px]'>
              <h1 className='uppercase md:text-xl font-bold'>Spaghetti</h1>
              <span>Small</span>
            </div>
            <h2 className='font-bold'>$29.90</h2>
            <span className='cursor-pointer'>X</span>
        </div>

        {/* SINGLE ITEM */}
        <div className='flex items-center justify-between m-2'>
            <Image src='/temporary/p7.png' alt='Product Image' width={100} height={100} className='object-contain  [@media(max-width:320px)]:hidden' />
            <div className='flex flex-col items-start min-w-[100px]'>
              <h1 className='uppercase md:text-xl font-bold'>Spaghetti</h1>
              <span>Small</span>
            </div>
            <h2 className='font-bold'>$29.90</h2>
            <span className='cursor-pointer'>X</span>
        </div>

        {/* SINGLE ITEM */}
        <div className='flex items-center justify-between m-2'>
            <Image src='/temporary/p7.png' alt='Product Image' width={100} height={100} className='object-contain  [@media(max-width:320px)]:hidden' />
            <div className='flex flex-col items-start min-w-[100px]'>
              <h1 className='uppercase md:text-xl font-bold'>Spaghetti</h1>
              <span>Small</span>
            </div>
            <h2 className='font-bold'>$29.90</h2>
            <span className='cursor-pointer'>X</span>
        </div>

        {/* SINGLE ITEM */}
        <div className='flex items-center justify-between m-2'>
            <Image src='/temporary/p7.png' alt='Product Image' width={100} height={100} className='object-contain  [@media(max-width:320px)]:hidden' />
            <div className='flex flex-col items-start min-w-[100px]'>
              <h1 className='uppercase md:text-xl font-bold'>Spaghetti</h1>
              <span>Small</span>
            </div>
            <h2 className='font-bold'>$29.90</h2>
            <span className='cursor-pointer'>X</span>
        </div>
     </div>

      {/* PAYMENT CONTAINER */}
      <div className='h-1/2 p-2 bg-fuchsia-50 flex flex-col gap-1 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 2xl:text-xl 2xl:gap-6'>
        <div className="flex justify-between items-center mb-2">
          <span className=''>Subtotal (3 Items)</span>
          <span className=''>$81.70</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className=''>Service Cost</span>
          <span className=''>$0.00</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className=''>Delivery Cost</span>
          <span className='text-green-500'>FREE!</span>
        </div>
        <hr className='my-3'/>
        <div className="flex justify-between items-center mb-2">
          <span className='uppercase'>Total(INCL. VAT)</span>
          <span className='font-bold'>$81.70</span>
        </div>
        <button className='bg-red-500 text-white p-3 rounded-md'>CHECKOUT</button>
      </div>
    </div>
  )
}

export default CartPage
