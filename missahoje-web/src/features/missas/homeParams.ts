import { parseWeekdaySlug, weekdaySlug, type Weekday } from './weekday';

export function parseDay(value: string | null): Weekday | null {
  return value ? parseWeekdaySlug(value) : null;
}

export function parseNeighborhood(value: string | null): string | null {
  return value?.trim() || null;
}

function toHref(params: URLSearchParams): string {
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

function hrefWith(current: string, name: string, value: string | null): string {
  const params = new URLSearchParams(current);
  if (value === null) params.delete(name);
  else params.set(name, value);
  return toHref(params);
}

export function hrefWithCity(current: string, citySlug: string): string {
  const params = new URLSearchParams(current);
  params.delete('bairro');
  params.delete('cidade');
  const ordered = new URLSearchParams([['cidade', citySlug], ...params]);
  return toHref(ordered);
}

export function hrefWithDay(current: string, day: Weekday | null): string {
  return hrefWith(current, 'dia', day === null ? null : weekdaySlug(day));
}

export function hrefWithNeighborhood(current: string, neighborhood: string | null): string {
  return hrefWith(current, 'bairro', neighborhood);
}
