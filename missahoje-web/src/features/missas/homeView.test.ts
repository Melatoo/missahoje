import { describe, expect, it } from 'vitest';
import { resolveHomeView } from './homeView';

const pronto = { initialized: true, hasCidade: true, status: 'success', isEmpty: false } as const;

describe('qual estado a home mostra', () => {
  it('antes de ler URL e cookie, carrega', () => {
    expect(resolveHomeView({ ...pronto, initialized: false, hasCidade: false })).toBe('loading');
  });

  it('sem cidade, pede para escolher uma', () => {
    expect(resolveHomeView({ ...pronto, hasCidade: false, status: 'pending' })).toBe('no-city');
  });

  it('buscando, carrega', () => {
    expect(resolveHomeView({ ...pronto, status: 'pending' })).toBe('loading');
  });

  it('falha de rede é erro', () => {
    expect(resolveHomeView({ ...pronto, status: 'error' })).toBe('error');
  });

  it('sem missas é vazio', () => {
    expect(resolveHomeView({ ...pronto, isEmpty: true })).toBe('empty');
  });

  it('com missas mostra a lista', () => {
    expect(resolveHomeView(pronto)).toBe('ready');
  });
});
