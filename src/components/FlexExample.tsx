export default function FlexExample() {
  return (
    <div className="space-y-10 p-6 text-white bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">🎯 Exemplos de Flex no Tailwind</h1>

      {/* 1. flex-row com flex-1 */}
      <Section title="1️⃣ flex-row com flex-1">
        <div className="flex border border-white rounded overflow-hidden">
          <Box className="bg-red-500 w-20">A</Box>
          <Box className="bg-blue-500 flex-1">B (flex-1)</Box>
          <Box className="bg-green-500 w-20">C</Box>
        </div>
        <Hint>O B ocupa todo o espaço restante.</Hint>
      </Section>

      {/* 2. Sem flex-1 */}
      <Section title="2️⃣ Sem flex-1">
        <div className="flex border border-white rounded overflow-hidden">
          <Box className="bg-red-500 w-20">A</Box>
          <Box className="bg-blue-500">B</Box>
          <Box className="bg-green-500 w-20">C</Box>
        </div>
        <Hint>B só usa o espaço do conteúdo.</Hint>
      </Section>

      {/* 3. flex-col */}
      <Section title="3️⃣ flex-col">
        <div className="flex flex-col border border-white rounded w-40">
          <Box className="bg-yellow-500">A</Box>
          <Box className="bg-purple-500">B</Box>
          <Box className="bg-pink-500">C</Box>
        </div>
        <Hint>Os itens são empilhados verticalmente.</Hint>
      </Section>

      {/* 4. justify-between */}
      <Section title="4️⃣ justify-between">
        <div className="flex justify-between border border-white rounded p-2">
          <Box className="bg-cyan-600">A</Box>
          <Box className="bg-cyan-600">B</Box>
          <Box className="bg-cyan-600">C</Box>
        </div>
        <Hint>Espaço igual entre os itens.</Hint>
      </Section>

      {/* 5. items-center */}
      <Section title="5️⃣ items-center">
        <div className="flex items-center border border-white rounded h-24">
          <Box className="bg-emerald-600 h-8">A</Box>
          <Box className="bg-emerald-600 h-16">B</Box>
          <Box className="bg-emerald-600 h-12">C</Box>
        </div>
        <Hint>Itens alinhados verticalmente ao centro.</Hint>
      </Section>

      {/* 6. flex-none, grow */}
      <Section title="6️⃣ flex-none + grow">
        <div className="flex border border-white rounded">
          <Box className="bg-indigo-600 flex-none w-24">A</Box>
          <Box className="bg-indigo-400 grow">B</Box>
          <Box className="bg-indigo-600 flex-none w-24">C</Box>
        </div>
        <Hint>Apenas B cresce.</Hint>
      </Section>

      {/* 7. flex-wrap */}
      <Section title="7️⃣ flex-wrap">
        <div className="flex flex-wrap border border-white rounded gap-2 max-w-sm">
          <Box className="bg-orange-500 w-40">A</Box>
          <Box className="bg-orange-500 w-40">B</Box>
          <Box className="bg-orange-500 w-40">C</Box>
        </div>
        <Hint>Os itens quebram linha quando necessário.</Hint>
      </Section>

      {/* 8. gap-x gap-y */}
      <Section title="8️⃣ gap-x / gap-y">
        <div className="flex flex-wrap gap-x-6 gap-y-4 border border-white rounded p-2 max-w-sm">
          <Box className="bg-lime-500 w-24">A</Box>
          <Box className="bg-lime-500 w-24">B</Box>
          <Box className="bg-lime-500 w-24">C</Box>
          <Box className="bg-lime-500 w-24">D</Box>
        </div>
        <Hint>Controle do espaçamento entre colunas e linhas.</Hint>
      </Section>

      {/* 9. basis (largura inicial) */}
      <Section title="9️⃣ basis-* (flex-basis)">
        <div className="flex border border-white rounded overflow-hidden">
          <Box className="bg-pink-500 basis-1/4">25%</Box>
          <Box className="bg-pink-400 basis-1/2">50%</Box>
          <Box className="bg-pink-500 basis-1/4">25%</Box>
        </div>
        <Hint>Define a base de largura de cada item.</Hint>
      </Section>

      {/* 10. order (ordem flexível) */}
      <Section title="🔟 order-*">
        <div className="flex border border-white rounded overflow-hidden">
          <Box className="bg-sky-500 order-3">A (3)</Box>
          <Box className="bg-sky-600 order-1">B (1)</Box>
          <Box className="bg-sky-700 order-2">C (2)</Box>
        </div>
        <Hint>Reorganiza os itens visualmente, sem mudar o HTML.</Hint>
      </Section>
    </div>
  );
}

// Componentes auxiliares para manter o código limpo:
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Box({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`p-2 text-center rounded shadow ${className}`}>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm mt-1 text-gray-400 italic">{children}</p>
  );
}
