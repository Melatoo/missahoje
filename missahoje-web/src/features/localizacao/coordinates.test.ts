import { describe, expect, it } from 'vitest';
import { parseCoordinates, truncateCoordinate, truncateCoordinates } from './coordinates';

describe('truncagem de coordenadas', () => {
  it('trunca para 3 casas decimais sem arredondar', () => {
    expect(truncateCoordinate(-21.24599)).toBe(-21.245);
    expect(truncateCoordinate(-44.99999)).toBe(-44.999);
    expect(truncateCoordinate(10.0009)).toBe(10);
  });

  it('posições a poucos metros uma da outra geram a mesma chave', () => {
    const a = truncateCoordinates({ lat: -21.24511, lng: -44.99902 });
    const b = truncateCoordinates({ lat: -21.24587, lng: -44.99968 });

    expect(a).toEqual(b);
  });
});

describe('leitura de coordenadas em texto', () => {
  it('converte e trunca lat e lng válidas', () => {
    expect(parseCoordinates('-21.24567', '-44.99912')).toEqual({ lat: -21.245, lng: -44.999 });
  });

  it.each([
    [null, '-44.999'],
    ['-21.245', undefined],
    ['', ''],
    ['abc', '-44.999'],
    ['-91', '-44.999'],
    ['-21.245', '181'],
  ])('rejeita lat=%s lng=%s', (lat, lng) => {
    expect(parseCoordinates(lat, lng)).toBeNull();
  });
});
