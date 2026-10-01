import { describe, expect, it } from 'vitest';
import { formatTimeUntil } from './timeUntil';

describe('"Daqui a X"', () => {
  it.each([
    [0, 'Agora'],
    [1, 'Daqui a 1 min'],
    [25, 'Daqui a 25 min'],
    [60, 'Daqui a 1h'],
    [80, 'Daqui a 1h 20min'],
    [8 * 60, 'Daqui a 8h'],
    [24 * 60, 'Daqui a 1 dia'],
    [2 * 24 * 60 + 660, 'Daqui a 2 dias'],
  ])('%i min → %s', (minutes, text) => {
    expect(formatTimeUntil(minutes)).toBe(text);
  });
});
