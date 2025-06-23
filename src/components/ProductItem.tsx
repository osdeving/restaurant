import Image from "next/image";
import React from "react";

function ProductItem() {
  return (
    <div className="flex items-center justify-between m-2">
      <Image
        src="/temporary/p1.png"
        alt="Product Image"
        width={100}
        height={100}
        className="object-contain [@media(max-width:320px)]:hidden"
      />
      <div className="flex flex-col items-start min-w-[100px]">
        <h1 className="uppercase md:text-xl font-bold">Pizza</h1>
        <span>Large</span>
      </div>
      <h2 className="font-bold">$79.90</h2>
      <span className="cursor-pointer">X</span>
    </div>
  );
}
export default ProductItem;


