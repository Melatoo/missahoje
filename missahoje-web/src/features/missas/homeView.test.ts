import { describe, expect, it } from 'vitest';
import { resolveHomeView } from './homeView';

const ready = { initialized: true, hasCity: true, status: 'success', isEmpty: false } as const;

describe('qual estado a home mostra', () => {
  it('antes de ler URL e cookie, carrega', () => {
    expect(resolveHomeView({ ...ready, initialized: false, hasCity: false })).toBe('loading');
  });

  it('sem cidade, pede para escolher uma', () => {
    expect(resolveHomeView({ ...ready, hasCity: false, status: 'pending' })).toBe('no-city');
  });

  it('buscando, carrega', () => {
    expect(resolveHomeView({ ...ready, status: 'pending' })).toBe('loading');
  });

  it('falha de rede é erro', () => {
    expect(resolveHomeView({ ...ready, status: 'error' })).toBe('error');
  });

  it('sem missas é vazio', () => {
    expect(resolveHomeView({ ...ready, isEmpty: true })).toBe('empty');
  });

  it('com missas mostra a lista', () => {
    expect(resolveHomeView(ready)).toBe('ready');
  });
});
