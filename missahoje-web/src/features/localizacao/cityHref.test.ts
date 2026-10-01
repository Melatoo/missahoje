import { describe, expect, it } from 'vitest';
import { hrefWithCity, hrefWithoutCity } from './cityHref';

describe('?cidade= na URL', () => {
  it('trocar de cidade mantém o dia e descarta o bairro da cidade anterior', () => {
    expect(hrefWithCity('cidade=belo-horizonte&bairro=Savassi&dia=sexta', 'lavras')).toBe('/?cidade=lavras&dia=sexta');
  });

  it('trocar de cidade sem params só põe a cidade', () => {
    expect(hrefWithCity('', 'lavras')).toBe('/?cidade=lavras');
  });

  it('abandonar o link tira a cidade e o bairro e mantém o dia', () => {
    expect(hrefWithoutCity('cidade=atlantida&bairro=Centro&dia=sexta')).toBe('/?dia=sexta');
    expect(hrefWithoutCity('cidade=atlantida')).toBe('/');
  });
});
