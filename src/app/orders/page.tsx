import React from 'react'

function OrdersPage() {
  return (
    <div className='p-4 lg:px-20 xl:px-40'>
      <table className='w-full border-separate border-spacing-3'>
        <thead className=''>
          <tr className='text-left text-sm md:text-base text-gray-500'>
            <th className='hidden md:block'>Order ID</th>
            <th className=''>Date</th>
            <th className=''>Price</th>
            <th className='hidden md:block'>Products</th>
            <th className=''>Status</th>
          </tr>
        </thead>
        <tbody className='text-black'>
          <tr className='text-sm md:text-base bg-red-50'>
            <td className='py-6 px-1 hidden md:block'>#12345</td>
            <td className='py-6 px-1'>2023-10-01</td>
            <td className='py-6 px-1'>$59.90</td>
            <td className='py-6 px-1 hidden md:block'>Big Burger Menu (2), Veggie Pizza (2), Coca Cola 1L (2)</td>
            <td className='py-6 px-1'>On the way (approx. 10min)...</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className='py-6 px-1 hidden md:block'>#12346</td>
            <td className='py-6 px-1'>2023-10-02</td>
            <td className='py-6 px-1'>$89.99</td>
            <td className='py-6 px-1 hidden md:block'>Product C</td>
            <td className='py-6 px-1'>Pending</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className='py-6 px-1 hidden md:block'>#12347</td>
            <td className='py-6 px-1 '>2023-10-03</td>
            <td className='py-6 px-1 '>$120.00</td>
            <td className='py-6 px-1 hidden md:block'>Product D, Product E, Product F</td>
            <td className='py-6 px-1'>Cancelled</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className='py-6 px-1 hidden md:block'>#12348</td>
            <td className='py-6 px-1 '>2023-10-04</td>
            <td className='py-6 px-1 '>$45.50</td>
            <td className='py-6 px-1 hidden md:block'>Product G</td>
            <td className='py-6 px-1'>Delivered</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default OrdersPage;
