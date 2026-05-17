import Image from "next/image";
import React from "react";
import { formatCurrency } from "@/config/site";

function ProductItem() {
  return (
    <div className="flex items-center justify-between m-2">
      <Image
        src="/temporary/p1.png"
        alt="Marmitex tradicional"
        width={100}
        height={100}
        className="object-contain [@media(max-width:320px)]:hidden"
      />
      <div className="flex flex-col items-start min-w-[100px]">
        <h1 className="uppercase md:text-xl font-bold">Marmitex</h1>
        <span>Individual</span>
      </div>
      <h2 className="font-bold">{formatCurrency(24.9)}</h2>
      <span className="cursor-pointer">X</span>
    </div>
  );
}
export default ProductItem;

