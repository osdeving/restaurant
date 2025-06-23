import React from 'react'

export default function LayoutExample() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="bg-red-500 text-white h-16 flex items-center justify-center">
        Header (16rem)
      </header>

      {/* MAIN */}
      <main className="flex-1 bg-gray-100 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>
        <p className="mb-4">Aqui vai o conteúdo principal que pode crescer.</p>
        <div className="h-[2000px] bg-blue-200">Conteúdo de teste para rolagem</div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white h-16 flex items-center justify-center">
        Footer (16rem)
      </footer>
    </div>
  );
}
