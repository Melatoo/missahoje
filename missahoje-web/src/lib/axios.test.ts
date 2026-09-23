import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const compose = readFileSync(resolve(__dirname, '../../../missahoje-api/docker-compose.yml'), 'utf8');
const apiService = compose.split(/^  db:/m)[0];

function apiPublishedPort() {
  const port = apiService.match(/^\s+-\s*"(\d+):\d+"/m)?.[1];
  if (!port) throw new Error('Porta da API não encontrada no docker-compose.yml');
  return port;
}

describe('URL base da API', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('a API escuta, dentro do container, na porta que o docker-compose encaminha', () => {
    const containerPort = apiService.match(/^\s+-\s*"\d+:(\d+)"/m)?.[1];

    expect(apiService).toMatch(new RegExp(`^\\s+-\\s*PORT=${containerPort}$`, 'm'));
  });

  it('sem NEXT_PUBLIC_API_URL, aponta para a porta publicada pelo docker-compose da API', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    const { api } = await import('./axios');

    expect(api.defaults.baseURL).toBe(`http://localhost:${apiPublishedPort()}`);
  });

  it('.env.example aponta para a porta publicada pelo docker-compose da API', () => {
    const envExample = readFileSync(resolve(__dirname, '../../.env.example'), 'utf8');

    expect(envExample).toContain(`NEXT_PUBLIC_API_URL=http://localhost:${apiPublishedPort()}`);
  });

  it('respeita NEXT_PUBLIC_API_URL quando definida', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    const { api } = await import('./axios');

    expect(api.defaults.baseURL).toBe('https://api.example.com');
  });
});
