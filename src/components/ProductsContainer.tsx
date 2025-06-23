'use client';

import { useRef, useState, useEffect } from "react";
import ProductItem from "./ProductItem"; // Import your ProductItem component

function ProductContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScrollIndicators = () => {
      setShowTop(el.scrollTop > 0);
      setShowBottom(el.scrollTop + el.clientHeight < el.scrollHeight);
    };

    updateScrollIndicators();
    el.addEventListener("scroll", updateScrollIndicators);
    return () => el.removeEventListener("scroll", updateScrollIndicators);
  }, []);

  return (
    <div className="h-2/3 lg:h-full relative flex flex-col lg:w-2/3 2xl:w-1/2">
      {/* Gradiente + seta cima */}
      <div className={`pointer-events-none absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-red-100 to-transparent z-10 flex justify-center items-start transition-opacity duration-300 ${showTop ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-xs text-red-400/70 animate-bounce">▲</span>
      </div>

      {/* Gradiente + seta baixo */}
      <div className={`pointer-events-none absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-red-100 to-transparent z-10 flex justify-center items-end transition-opacity duration-300 ${showBottom ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-xs text-red-400/70 animate-bounce">▼</span>
      </div>

      {/* Scrollable Product List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll scroll-hidden px-4 py-2 flex flex-col gap-4"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductItem key={index} />
        ))}
      </div>
    </div>
  );
}

export default ProductContainer;
