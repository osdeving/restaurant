'use client';

import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  return <div>{session ? `Hello ${session.user?.name}` : 'Not signed in'}</div>;
}
