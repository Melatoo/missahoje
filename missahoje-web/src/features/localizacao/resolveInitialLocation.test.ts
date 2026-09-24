import { describe, expect, it } from 'vitest';
import type { LocalizacaoSalva } from './persistence';
import { resolveInitialLocation } from './resolveInitialLocation';

const nadaSalvo: LocalizacaoSalva = { coordinates: null, cidade: null, origemCidade: null };
const salvo: LocalizacaoSalva = {
  coordinates: { lat: -19.932, lng: -43.938 },
  cidade: { id: 'c2', nome: 'Belo Horizonte', estado: 'MG', slug: 'belo-horizonte' },
  origemCidade: 'gps',
};

const params = (query: string) => new URLSearchParams(query);

describe('precedência da localização inicial: URL > cookie > GPS', () => {
  it('coordenada na URL manda, mesmo com cookie salvo', () => {
    expect(resolveInitialLocation(params('lat=-21.24567&lng=-44.99912'), salvo)).toEqual({
      origem: 'url',
      coordinates: { lat: -21.245, lng: -44.999 },
      cidadeSlug: null,
      bairro: null,
    });
  });

  it('slug de cidade e bairro na URL também mandam', () => {
    expect(resolveInitialLocation(params('cidade=lavras&bairro=centro'), salvo)).toEqual({
      origem: 'url',
      coordinates: null,
      cidadeSlug: 'lavras',
      bairro: 'centro',
    });
  });

  it('bairro sem cidade na URL é ignorado', () => {
    expect(resolveInitialLocation(params('bairro=centro'), salvo).origem).toBe('cookie');
  });

  it('coordenada inválida na URL cai no cookie', () => {
    expect(resolveInitialLocation(params('lat=abc&lng=-44.999'), salvo)).toEqual({ origem: 'cookie', ...salvo });
  });

  it('sem URL, usa o cookie', () => {
    expect(resolveInitialLocation(params(''), salvo)).toEqual({ origem: 'cookie', ...salvo });
  });

  it('sem URL nem cookie, não há localização e o GPS decide', () => {
    expect(resolveInitialLocation(params('outro=1'), nadaSalvo)).toEqual({ origem: 'nenhuma' });
  });
});
