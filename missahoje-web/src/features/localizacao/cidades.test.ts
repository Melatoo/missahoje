import { describe, expect, it } from 'vitest';
import { cidadeLabel, filterCidades, findCidadeBySlug } from './cidades';

const lavras = { id: 'c1', nome: 'Lavras', estado: 'MG', slug: 'lavras' };
const sjdr = { id: 'c2', nome: 'São João del-Rei', estado: 'MG', slug: 'sao-joao-del-rei' };
const bh = { id: 'c3', nome: 'Belo Horizonte', estado: 'MG', slug: 'belo-horizonte' };
const ijaci = { id: 'c4', nome: 'Ijaci', estado: 'MG', slug: 'ijaci' };
const cidades = [lavras, sjdr, bh, ijaci];

const nomes = (lista: { nome: string }[]) => lista.map((cidade) => cidade.nome);

describe('busca de cidade no seletor', () => {
  it('"Lav" encontra Lavras', () => {
    expect(nomes(filterCidades(cidades, 'Lav'))).toEqual(['Lavras']);
  });

  it('ignora acento e caixa', () => {
    expect(nomes(filterCidades(cidades, 'sao joao'))).toEqual(['São João del-Rei']);
    expect(nomes(filterCidades(cidades, 'LAVRAS'))).toEqual(['Lavras']);
  });

  it('acha pelo começo de qualquer palavra, depois de quem começa pelo termo', () => {
    expect(nomes(filterCidades([...cidades, { id: 'c5', nome: 'Horizontina', estado: 'RS', slug: 'horizontina' }], 'hori'))).toEqual([
      'Horizontina',
      'Belo Horizonte',
    ]);
    expect(nomes(filterCidades(cidades, 'rei'))).toEqual(['São João del-Rei']);
  });

  it('não acha pelo meio da palavra', () => {
    expect(filterCidades(cidades, 'vras')).toEqual([]);
  });

  it('sem termo, lista todas em ordem alfabética', () => {
    expect(nomes(filterCidades(cidades, '  '))).toEqual(['Belo Horizonte', 'Ijaci', 'Lavras', 'São João del-Rei']);
  });

  it('mostra a cidade com o estado', () => {
    expect(cidadeLabel(lavras)).toBe('Lavras – MG');
  });
});

describe('cidade do link compartilhado', () => {
  it('resolve o slug para a cidade', () => {
    expect(findCidadeBySlug(cidades, 'sao-joao-del-rei')).toEqual(sjdr);
  });

  it('tolera caixa alta e espaços no slug', () => {
    expect(findCidadeBySlug(cidades, ' Lavras ')).toEqual(lavras);
  });

  it('slug desconhecido não resolve', () => {
    expect(findCidadeBySlug(cidades, 'atlantida')).toBeNull();
  });
});
