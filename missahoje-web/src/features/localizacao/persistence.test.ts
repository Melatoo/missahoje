import { describe, expect, it } from 'vitest';
import { cidadeCookie, coordinatesCookies, parseCookies, readLocalizacao } from './persistence';

const lavras = { id: 'c1', nome: 'Lavras', estado: 'MG', slug: 'lavras' };

function header(cookies: string[]) {
  return cookies.map((cookie) => cookie.split(';')[0]).join('; ');
}

describe('persistência da localização em cookie', () => {
  it('lê de volta as coordenadas que gravou', () => {
    const salvo = readLocalizacao(header(coordinatesCookies({ lat: -21.245, lng: -44.999 })));

    expect(salvo.coordinates).toEqual({ lat: -21.245, lng: -44.999 });
  });

  it('lê de volta a cidade que gravou, com a origem da escolha', () => {
    const salvo = readLocalizacao(header([cidadeCookie(lavras, 'manual')]));

    expect(salvo.cidade).toEqual(lavras);
    expect(salvo.origemCidade).toBe('manual');
  });

  it('grava cookies de um ano, válidos no site inteiro', () => {
    const [cookie] = coordinatesCookies({ lat: -21.245, lng: -44.999 });

    expect(cookie).toContain('Path=/');
    expect(cookie).toContain(`Max-Age=${60 * 60 * 24 * 365}`);
    expect(cookie).toContain('SameSite=Lax');
  });

  it('sem cookies, não há nada salvo', () => {
    expect(readLocalizacao('')).toEqual({ coordinates: null, cidade: null, origemCidade: null });
  });

  it('ignora cookie de cidade corrompido ou incompleto', () => {
    expect(readLocalizacao('cidade=%7Bquebrado').cidade).toBeNull();
    expect(readLocalizacao(`cidade=${encodeURIComponent('{"id":"c1","nome":"Lavras"}')}`).cidade).toBeNull();
    expect(readLocalizacao(`cidade=${encodeURIComponent(JSON.stringify({ ...lavras, origem: 'outra' }))}`).cidade).toBeNull();
  });

  it('ignora coordenadas inválidas', () => {
    expect(readLocalizacao('user_lat=abc; user_lng=-44.999').coordinates).toBeNull();
  });

  it('não quebra com cookies alheios ou mal codificados', () => {
    expect(parseCookies('foo=bar; ruim=%E0%A4%A; =semnome; solto')).toEqual({ foo: 'bar' });
  });
});
