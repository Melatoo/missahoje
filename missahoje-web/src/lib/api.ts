import { PaginatedResponse, Cidade, HorarioMissa } from '../types';

const IS_SERVER = typeof window === 'undefined';
const API_URL = IS_SERVER 
  ? (process.env.SSR_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

export async function getCidades(page = 1, limit = 100): Promise<PaginatedResponse<Cidade>> {
  const res = await fetch(`${API_URL}/cidades?page=${page}&limit=${limit}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`Falha ao buscar cidades: ${res.statusText}`);
  }

  return res.json();
}

export async function getMissas(cidadeId?: string, diaSemana?: number, page = 1, limit = 50): Promise<PaginatedResponse<HorarioMissa>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (cidadeId) {
    params.append('cidadeId', cidadeId);
  }
  if (diaSemana !== undefined) {
    params.append('dia_semana', diaSemana.toString());
  }

  const res = await fetch(`${API_URL}/missas?${params.toString()}`, {
    cache: 'no-store', // Missas times can change or we want fresh data for "Next mass"
  });

  if (!res.ok) {
    throw new Error(`Falha ao buscar missas: ${res.statusText}`);
  }

  return res.json();
}
