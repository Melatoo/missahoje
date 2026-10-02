import { homeHref } from '../../lib/homeHref';
import { parseWeekdaySlug, weekdaySlug, type Weekday } from './weekday';

export function parseDay(value: string | null): Weekday | null {
  return value ? parseWeekdaySlug(value) : null;
}

export function parseNeighborhood(value: string | null): string | null {
  return value?.trim() || null;
}

function hrefWith(current: string, name: string, value: string | null): string {
  const params = new URLSearchParams(current);
  if (value === null) params.delete(name);
  else params.set(name, value);
  return homeHref(params);
}

export function hrefWithDay(current: string, day: Weekday | null): string {
  return hrefWith(current, 'dia', day === null ? null : weekdaySlug(day));
}

export function hrefWithNeighborhood(current: string, neighborhood: string | null): string {
  return hrefWith(current, 'bairro', neighborhood);
}
