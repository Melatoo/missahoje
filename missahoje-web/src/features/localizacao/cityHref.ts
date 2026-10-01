import { homeHref } from '../../lib/homeHref';

function withoutCity(current: string): URLSearchParams {
  const params = new URLSearchParams(current);
  params.delete('cidade');
  params.delete('bairro');
  return params;
}

export function hrefWithCity(current: string, citySlug: string): string {
  return homeHref(new URLSearchParams([['cidade', citySlug], ...withoutCity(current)]));
}

export function hrefWithoutCity(current: string): string {
  return homeHref(withoutCity(current));
}
