import { describe, expect, it } from 'vitest';
import { canOfferLocation, locationMessage } from './locationMessage';

describe('aviso da localização', () => {
  it('sem aviso nem bloqueio, não mostra nada', () => {
    expect(locationMessage({ feedback: null, permissionStatus: 'prompt', hasCity: false })).toBeNull();
  });

  it('bloqueada e sem cidade, explica onde liberar', () => {
    expect(locationMessage({ feedback: null, permissionStatus: 'denied', hasCity: false })).toContain(
      'configurações do navegador',
    );
  });

  it('bloqueada mas já com cidade, não insiste no assunto', () => {
    expect(locationMessage({ feedback: null, permissionStatus: 'denied', hasCity: true })).toBeNull();
  });

  it('negada agora pelo usuário, explica mesmo com cidade', () => {
    expect(locationMessage({ feedback: 'denied', permissionStatus: 'denied', hasCity: true })).toContain(
      'configurações do navegador',
    );
  });

  it('posição indisponível oferece tentar de novo ou a lista', () => {
    expect(locationMessage({ feedback: 'unavailable', permissionStatus: 'prompt', hasCity: false })).toContain(
      'Tente de novo',
    );
  });

  it('fora das cidades atendidas, manda para a lista', () => {
    expect(locationMessage({ feedback: 'not-found', permissionStatus: 'granted', hasCity: false })).toContain(
      'Escolha uma cidade',
    );
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
