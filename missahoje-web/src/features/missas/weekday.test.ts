import { describe, expect, it } from 'vitest';
import { addDays, toWeekday, type Weekday } from './weekday';

describe('soma de dias da semana', () => {
  it.each<[Weekday, number, Weekday]>([
    [3, 2, 5],
    [6, 1, 0],
    [0, 7, 0],
    [0, -1, 6],
  ])('%i + %i → %i', (weekday, days, expected) => {
    expect(addDays(weekday, days)).toBe(expected);
  });
});

describe('dia da semana vindo da API', () => {
  it.each([0, 3, 6])('%i é válido', (value) => {
    expect(toWeekday(value)).toBe(value);
  });

  it.each([7, -1, 1.5, NaN])('%s é rejeitado', (value) => {
    expect(() => toWeekday(value)).toThrow(RangeError);
  });
});
