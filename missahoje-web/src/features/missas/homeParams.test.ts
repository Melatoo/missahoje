import { describe, expect, it } from 'vitest';
import { hrefWithDay, hrefWithNeighborhood, parseDay, parseNeighborhood } from './homeParams';

describe('?dia= na URL', () => {
  it.each([
    ['domingo', 0],
    ['segunda', 1],
    ['terca', 2],
    ['quarta', 3],
    ['quinta', 4],
    ['sexta', 5],
    ['sabado', 6],
    ['Quarta', 3],
  ])('%s → %i', (value, day) => {
    expect(parseDay(value)).toBe(day);
  });

  it.each([null, '', '3', 'feriado'])('%s é ignorado', (value) => {
    expect(parseDay(value)).toBeNull();
  });
});

describe('?bairro= na URL', () => {
  it('limpa espaços', () => {
    expect(parseNeighborhood('  Centro ')).toBe('Centro');
  });

  it.each([null, '', '   '])('%s vira null', (value) => {
    expect(parseNeighborhood(value)).toBeNull();
  });
});

describe('links que trocam o filtro', () => {
  it('troca o dia e mantém os outros params', () => {
    expect(hrefWithDay('cidade=lavras&bairro=Centro', 1)).toBe('/?cidade=lavras&bairro=Centro&dia=segunda');
  });

  it('dia null volta para hoje', () => {
    expect(hrefWithDay('dia=quarta&bairro=Centro', null)).toBe('/?bairro=Centro');
  });

  it('sem nenhum param sobra só a raiz', () => {
    expect(hrefWithDay('dia=quarta', null)).toBe('/');
  });

  it('remove o bairro', () => {
    expect(hrefWithNeighborhood('bairro=Centro&dia=sexta', null)).toBe('/?dia=sexta');
  });
});
