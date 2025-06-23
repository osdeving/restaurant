import React from "react";
import ProductContainer from "../../components/ProductsContainer";

function PaymentContainer() {
  return (
    <div className="h-1/3 lg:h-full lg:w-1/3 2xl:w-1/2 bg-fuchsia-50 p-4 flex flex-col justify-center gap-2 2xl:text-xl">

      <div className="flex justify-between items-center">
        <span>Subtotal (3 Items)</span>
        <span>$81.70</span>
      </div>

      <div className="flex justify-between items-center">
        <span>Service Cost</span>
        <span>$0.00</span>
      </div>

      <div className="flex justify-between items-center">
        <span>Delivery Cost</span>
        <span className="text-green-500">FREE!</span>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between items-center">
        <span className="uppercase">Total (incl. VAT)</span>
        <span className="font-bold">$81.70</span>
      </div>

      <button className="bg-red-500 text-white p-3 rounded-md mt-4">CHECKOUT</button>
    </div>
  );
}

export default function CartPage() {
  return (
    <div className="page-fit flex flex-col lg:flex-row border text-red-500 overflow-hidden">
      <ProductContainer />
      <PaymentContainer />
    </div>
  );
}
