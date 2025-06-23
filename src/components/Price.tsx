'use client';

import React from 'react'

type PriceProps = {
  price: number;
  id: number;
  options?: {
    title: string;
    additionalPrice: number;
  }[];
}

const Price = ({ price, options }:PriceProps) => {

    const [totalPrice, setTotalPrice] = React.useState(price);
    const [quantity, setQuantity] = React.useState(1);
    const [selectedOption, setSelectedOption] = React.useState(0);

    React.useEffect(() => {
        setTotalPrice(quantity * (price + (options && options[selectedOption] ? options[selectedOption].additionalPrice : 0)));
    }, [quantity, selectedOption, options, price]);

  return (
    <div className='flex flex-col gap-4'>
        {/* PRICE CONTAINER */}
        <h2 className='text-2xl font-bold'>${totalPrice.toFixed(2)}</h2>

        {/* OPTIONS CONTAINER */}
        <div className='flex gap-4'>
            {options && options.length > 0 && options.map((option, index) => (
                <button
                    key={index}
                    className='min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md'
                    style={{ backgroundColor: selectedOption === index ? 'rgb(248, 113,113)' : 'white',
                        color: selectedOption === index ? 'white' : 'red' }}
                    onClick={() => {
                        setSelectedOption(index);
                        setTotalPrice(price + option.additionalPrice);
                    }}
                    >
                    {option.title}
                </button>
            ))}
        </div>

        {/* QUANTITY AND BUTTON CONTAINER */}
        <div className='flex justify-between items-center'>
            {/* QUANTITY CONTAINER */}
            <div className='flex justify-between w-full p-3 ring-1 ring-red-500'>
                <span>Quantity</span>
                <div className='flex gap-3 items-center'>
                    <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>{'<'}</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(prev =>  Math.min(prev + 1, 9))}>{'>'}</button>
                </div>
            </div>
            {/* ADD TO CART BUTTON */}
            <button className='uppercase w-56 bg-red-500 text-white p-3 ring-1 ring-red-500'>Add to Cart</button>
        </div>
    </div>
  )
}

export default Price
