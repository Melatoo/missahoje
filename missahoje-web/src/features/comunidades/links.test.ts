import { describe, expect, it } from 'vitest';
import { externalLink, phoneHref } from './links';

describe('externalLink', () => {
  it('mantém URLs com protocolo e limpa o rótulo', () => {
    expect(externalLink('https://www.instagram.com/paroquia/')).toEqual({
      href: 'https://www.instagram.com/paroquia/',
      label: 'instagram.com/paroquia',
    });
  });

  it('completa o protocolo quando falta', () => {
    expect(externalLink(' paroquia.org.br ')).toEqual({ href: 'https://paroquia.org.br/', label: 'paroquia.org.br' });
  });

  it('não gera link para @usuário, texto vazio ou protocolo perigoso', () => {
    expect(externalLink('@paroquiasaojoao')).toBeNull();
    expect(externalLink('   ')).toBeNull();
    expect(externalLink('javascript:alert(1)')).toBeNull();
  });
});

describe('phoneHref', () => {
  it('reduz o telefone a dígitos', () => {
    expect(phoneHref('(35) 3821-1234')).toBe('tel:3538211234');
    expect(phoneHref('+55 35 99999-0000')).toBe('tel:+5535999990000');
  });

  it('ignora o que não parece telefone', () => {
    expect(phoneHref('ligar na secretaria')).toBeNull();
  });
});
