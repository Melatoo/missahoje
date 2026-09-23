import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const compose = readFileSync(resolve(__dirname, '../../../missahoje-api/docker-compose.yml'), 'utf8');
const servicoApi = compose.split(/^  db:/m)[0];

function portaPublicadaDaApi() {
  const porta = servicoApi.match(/^\s+-\s*"(\d+):\d+"/m)?.[1];
  if (!porta) throw new Error('Porta da API não encontrada no docker-compose.yml');
  return porta;
}

describe('URL base da API', () => {
  it('a API escuta, dentro do container, na porta que o docker-compose encaminha', () => {
    const portaDoContainer = servicoApi.match(/^\s+-\s*"\d+:(\d+)"/m)?.[1];

    expect(servicoApi).toMatch(new RegExp(`^\\s+-\\s*PORT=${portaDoContainer}$`, 'm'));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('sem NEXT_PUBLIC_API_URL, aponta para a porta publicada pelo docker-compose da API', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    const { api } = await import('./axios');

    expect(api.defaults.baseURL).toBe(`http://localhost:${portaPublicadaDaApi()}`);
  });

  it('.env.example aponta para a porta publicada pelo docker-compose da API', () => {
    const exemplo = readFileSync(resolve(__dirname, '../../.env.example'), 'utf8');

    expect(exemplo).toContain(`NEXT_PUBLIC_API_URL=http://localhost:${portaPublicadaDaApi()}`);
  });

  it('respeita NEXT_PUBLIC_API_URL quando definida', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.exemplo.com');
    const { api } = await import('./axios');

    expect(api.defaults.baseURL).toBe('https://api.exemplo.com');
  });
});
