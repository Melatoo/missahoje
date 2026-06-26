'use server'

import { cookies } from 'next/headers';

export async function setLocationCookie(cidadeId: string, cidadeNome: string) {
  const cookieStore = await cookies();
  cookieStore.set('cidadeId', cidadeId, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // 1 year
  cookieStore.set('cidadeNome', cidadeNome, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // 1 year
}

export async function getLocationCookie() {
  const cookieStore = await cookies();
  const cidadeId = cookieStore.get('cidadeId')?.value;
  const cidadeNome = cookieStore.get('cidadeNome')?.value;
  
  return { cidadeId, cidadeNome };
}
