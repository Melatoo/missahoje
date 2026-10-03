import { describe, expect, it } from 'vitest';
import { igrejaHref, igrejaSlug } from './igrejaHref';

const id = '3f2a8c1e-0b7d-4e5f-9a6b-1c2d3e4f5a6b';

describe('igrejaHref', () => {
  it('põe nome e cidade no slug, sem acento e em minúsculas', () => {
    expect(igrejaHref({ id, nome: 'Igreja São Sebastião', cidade: { nome: 'Lavras' } })).toBe(
      `/igreja/${id}/igreja-sao-sebastiao-lavras`,
    );
  });

  it('troca pontuação e espaços repetidos por um hífen só', () => {
    expect(igrejaSlug({ id, nome: '  N. Sra. Aparecida (Matriz) ', cidade: { nome: 'São João del-Rei' } })).toBe(
      'n-sra-aparecida-matriz-sao-joao-del-rei',
    );
  });

  it('usa só o nome quando a cidade não veio', () => {
    expect(igrejaHref({ id, nome: 'Capela Santa Rita' })).toBe(`/igreja/${id}/capela-santa-rita`);
  });

  it('cai no id puro quando o nome não gera slug', () => {
    expect(igrejaHref({ id, nome: '***' })).toBe(`/igreja/${id}`);
  });
});
