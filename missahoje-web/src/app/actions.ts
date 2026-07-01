'use server';

import { cookies } from 'next/headers';

export async function getLocationCookie() {
  const cookieStore = await cookies();
  const cidadeId = cookieStore.get('cidadeId')?.value;
  const cidadeNome = cookieStore.get('cidadeNome')?.value;
  return { cidadeId, cidadeNome };
}

export async function setLocationCookie(cidadeId: string, cidadeNome: string) {
  const cookieStore = await cookies();
  cookieStore.set('cidadeId', cidadeId, { path: '/', maxAge: 30 * 24 * 60 * 60 });
  cookieStore.set('cidadeNome', cidadeNome, { path: '/', maxAge: 30 * 24 * 60 * 60 });
}

export async function clearLocationCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('cidadeId');
  cookieStore.delete('cidadeNome');
}
