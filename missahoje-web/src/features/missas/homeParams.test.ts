import { describe, expect, it } from 'vitest';
import { hrefWithBairro, hrefWithDia, parseBairro, parseDia } from './homeParams';

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
  ])('%s → %i', (valor, dia) => {
    expect(parseDia(valor)).toBe(dia);
  });

  it.each([null, '', '3', 'feriado'])('%s é ignorado', (valor) => {
    expect(parseDia(valor)).toBeNull();
  });
});

describe('?bairro= na URL', () => {
  it('limpa espaços', () => {
    expect(parseBairro('  Centro ')).toBe('Centro');
  });

  it.each([null, '', '   '])('%s vira null', (valor) => {
    expect(parseBairro(valor)).toBeNull();
  });
});

describe('links que trocam o filtro', () => {
  it('troca o dia e mantém os outros params', () => {
    expect(hrefWithDia('cidade=lavras&bairro=Centro', 1)).toBe('/?cidade=lavras&bairro=Centro&dia=segunda');
  });

  it('dia null volta para hoje', () => {
    expect(hrefWithDia('dia=quarta&bairro=Centro', null)).toBe('/?bairro=Centro');
  });

  it('sem nenhum param sobra só a raiz', () => {
    expect(hrefWithDia('dia=quarta', null)).toBe('/');
  });

  it('remove o bairro', () => {
    expect(hrefWithBairro('bairro=Centro&dia=sexta', null)).toBe('/?dia=sexta');
  });
});
