export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const NAMES = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const SLUGS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

export function isWeekday(value: number): value is Weekday {
  return Number.isInteger(value) && value >= 0 && value <= 6;
}

export function toWeekday(value: number): Weekday {
  if (!isWeekday(value)) throw new RangeError(`Invalid weekday: ${value}`);
  return value;
}

export function addDays(weekday: Weekday, days: number): Weekday {
  return toWeekday((((weekday + days) % 7) + 7) % 7);
}

export function weekdayName(weekday: Weekday): string {
  return NAMES[weekday];
}

export function weekdaySlug(weekday: Weekday): string {
  return SLUGS[weekday];
}

export function parseWeekdaySlug(value: string): Weekday | null {
  const index = SLUGS.indexOf(value.trim().toLowerCase());
  return isWeekday(index) ? index : null;
}
