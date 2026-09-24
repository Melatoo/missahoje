import { parseCoordinates } from './coordinates';
import type { CidadeSelecionada, Coordinates, OrigemCidade } from './types';

export const COOKIE_LAT = 'user_lat';
export const COOKIE_LNG = 'user_lng';
export const COOKIE_CIDADE = 'cidade';

const ONE_YEAR = 60 * 60 * 24 * 365;

export interface LocalizacaoSalva {
  coordinates: Coordinates | null;
  cidade: CidadeSelecionada | null;
  origemCidade: OrigemCidade | null;
}

export function parseCookies(header: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const name = part.slice(0, index).trim();
    if (!name) continue;
    try {
      cookies[name] = decodeURIComponent(part.slice(index + 1).trim());
    } catch {
      continue;
    }
  }
  return cookies;
}

function parseCidade(raw: string | undefined): Pick<LocalizacaoSalva, 'cidade' | 'origemCidade'> {
  const empty = { cidade: null, origemCidade: null };
  if (!raw) return empty;
  try {
    const value = JSON.parse(raw);
    const { id, nome, estado, slug, origem } = value ?? {};
    if (![id, nome, estado, slug].every((field) => typeof field === 'string')) return empty;
    if (!['gps', 'ip', 'manual'].includes(origem)) return empty;
    return { cidade: { id, nome, estado, slug }, origemCidade: origem };
  } catch {
    return empty;
  }
}

export function readLocalizacao(cookieHeader: string): LocalizacaoSalva {
  const cookies = parseCookies(cookieHeader);
  return {
    coordinates: parseCoordinates(cookies[COOKIE_LAT], cookies[COOKIE_LNG]),
    ...parseCidade(cookies[COOKIE_CIDADE]),
  };
}

function serialize(name: string, value: string): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

export function coordinatesCookies({ lat, lng }: Coordinates): string[] {
  return [serialize(COOKIE_LAT, String(lat)), serialize(COOKIE_LNG, String(lng))];
}

export function cidadeCookie(cidade: CidadeSelecionada, origem: OrigemCidade): string {
  const { id, nome, estado, slug } = cidade;
  return serialize(COOKIE_CIDADE, JSON.stringify({ id, nome, estado, slug, origem }));
}
