const DIA_SLUGS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

export function parseDia(value: string | null): number | null {
  if (!value) return null;
  const index = DIA_SLUGS.indexOf(value.trim().toLowerCase());
  return index === -1 ? null : index;
}

export function parseBairro(value: string | null): string | null {
  return value?.trim() || null;
}

function hrefWith(current: string, name: string, value: string | null): string {
  const params = new URLSearchParams(current);
  if (value === null) params.delete(name);
  else params.set(name, value);
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

export function hrefWithDia(current: string, dia: number | null): string {
  return hrefWith(current, 'dia', dia === null ? null : DIA_SLUGS[dia]);
}

export function hrefWithBairro(current: string, bairro: string | null): string {
  return hrefWith(current, 'bairro', bairro);
}
