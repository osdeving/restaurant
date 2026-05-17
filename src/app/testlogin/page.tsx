'use client';

import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Carregando...</div>;

  return <div>{session ? `Olá, ${session.user?.name}` : 'Você não está conectado'}</div>;
}
