import React from "react";
import ProductContainer from "../../components/ProductsContainer";
import { formatCurrency } from "@/config/site";

function PaymentContainer() {
  return (
    <div className="h-1/3 lg:h-full lg:w-1/3 2xl:w-1/2 bg-[#fff4c7] p-4 flex flex-col justify-center gap-2 2xl:text-xl">

      <div className="flex justify-between items-center">
        <span>Subtotal (3 itens)</span>
        <span>{formatCurrency(81.7)}</span>
      </div>

      <div className="flex justify-between items-center">
        <span>Taxa de serviço</span>
        <span>{formatCurrency(0)}</span>
      </div>

      <div className="flex justify-between items-center">
        <span>Taxa de entrega</span>
        <span className="text-green-600 font-bold">Grátis</span>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between items-center">
        <span className="uppercase">Total</span>
        <span className="font-bold">{formatCurrency(81.7)}</span>
      </div>

      <button className="bg-red-600 text-white p-3 rounded-md mt-4 font-bold uppercase">Finalizar pedido</button>
    </div>
  );
}

export default function CartPage() {
  return (
    <div className="page-fit flex flex-col lg:flex-row border text-red-600 overflow-hidden">
      <ProductContainer />
      <PaymentContainer />
    </div>
  );
}
