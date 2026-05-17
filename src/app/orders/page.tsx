import React from 'react'
import { formatCurrency } from '@/config/site'

const orders = [
  {
    id: '#12345',
    date: '01/10/2023',
    price: 59.9,
    products: 'Marmitex tradicional (2), refrigerante 1L (1)',
    status: 'Saiu para entrega',
  },
  {
    id: '#12346',
    date: '02/10/2023',
    price: 89.99,
    products: 'Prato-feito com bife (2), salada completa (1)',
    status: 'Em preparo',
  },
  {
    id: '#12347',
    date: '03/10/2023',
    price: 120,
    products: 'Marmitex parmegiana (3), feijoada da casa (1)',
    status: 'Cancelado',
  },
  {
    id: '#12348',
    date: '04/10/2023',
    price: 45.5,
    products: 'Frango grelhado (1), salada completa (1)',
    status: 'Entregue',
  },
]

function OrdersPage() {
  return (
    <div className='page-fit-scroll p-4 lg:px-20 xl:px-40'>
      <table className='w-full border-separate border-spacing-3'>
        <thead>
          <tr className='text-left text-sm md:text-base text-gray-500'>
            <th className='hidden md:block'>Pedido</th>
            <th>Data</th>
            <th>Valor</th>
            <th className='hidden md:block'>Produtos</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className='text-black'>
          {orders.map((order) => (
            <tr key={order.id} className='text-sm md:text-base odd:bg-[#fff4c7] even:bg-red-50'>
              <td className='py-6 px-1 hidden md:block'>{order.id}</td>
              <td className='py-6 px-1'>{order.date}</td>
              <td className='py-6 px-1'>{formatCurrency(order.price)}</td>
              <td className='py-6 px-1 hidden md:block'>{order.products}</td>
              <td className='py-6 px-1'>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersPage;
