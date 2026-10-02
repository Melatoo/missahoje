import { describe, expect, it } from 'vitest';
import { canOfferLocation, locationMessage } from './locationMessage';

describe('aviso da localização', () => {
  it('sem aviso nem bloqueio, não mostra nada', () => {
    expect(locationMessage({ feedback: null, permissionStatus: 'prompt' })).toBeNull();
  });

  it('bloqueada, explica onde liberar', () => {
    expect(locationMessage({ feedback: null, permissionStatus: 'denied' })).toContain('configurações do navegador');
  });

  it('negada agora pelo usuário, explica onde liberar', () => {
    expect(locationMessage({ feedback: 'denied', permissionStatus: 'denied' })).toContain(
      'configurações do navegador',
    );
  });

  it('posição indisponível oferece tentar de novo ou a lista', () => {
    expect(locationMessage({ feedback: 'unavailable', permissionStatus: 'prompt' })).toContain('Tente de novo');
  });

  it('fora das cidades atendidas, manda para a lista', () => {
    expect(locationMessage({ feedback: 'not-found', permissionStatus: 'granted' })).toContain('Escolha uma cidade');
  });
});

describe('botão de localização', () => {
  it('aparece enquanto o navegador ainda pode perguntar ou já deixou', () => {
    expect(canOfferLocation(true, 'prompt')).toBe(true);
    expect(canOfferLocation(true, 'granted')).toBe(true);
  });

  it('some quando a permissão foi negada, porque não faria mais nada', () => {
    expect(canOfferLocation(true, 'denied')).toBe(false);
  });

  it('some em HTTP ou sem a API', () => {
    expect(canOfferLocation(false, 'prompt')).toBe(false);
  });
});
