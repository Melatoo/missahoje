import { headers } from 'next/headers';
import type { GetResponse } from '@/types';
import type { Comunidade } from './types';

// Chamado no servidor: dentro do Docker a API não está em localhost, por isso o SSR_API_URL
function serverApiUrl(): string {
  return process.env.SSR_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

async function ssrHeaders(): Promise<Record<string, string> | undefined> {
  const token = process.env.SSR_API_TOKEN;
  if (!token) return undefined;

  const incoming = await headers();
  const clientIp = incoming.get('x-forwarded-for')?.split(',')[0].trim() || incoming.get('x-real-ip');
  return clientIp ? { 'x-ssr-token': token, 'x-ssr-client-ip': clientIp } : { 'x-ssr-token': token };
}

// null quando a comunidade não existe (404) ou o id não é um UUID (400)
export async function fetchComunidade(id: string): Promise<Comunidade | null> {
  // Mesmo limite do cliente axios: API travada não prende a renderização
  const response = await fetch(`${serverApiUrl()}/comunidades/${encodeURIComponent(id)}`, {
    signal: AbortSignal.timeout(10_000),
    headers: await ssrHeaders(),
  });
  if (response.status === 400 || response.status === 404) return null;
  if (!response.ok) throw new Error(`GET /comunidades/${id} respondeu ${response.status}`);

  return (await response.json()) as GetResponse<'/comunidades/{id}'>;
}
