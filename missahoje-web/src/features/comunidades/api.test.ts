import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const incoming = new Headers();

vi.mock('next/headers', () => ({
  headers: async () => incoming,
}));

const { fetchComunidade } = await import('./api');

describe('fetchComunidade', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockResolvedValue(new Response('{"data":{}}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    for (const nome of [...incoming.keys()]) incoming.delete(nome);
  });

  async function headersEnviados() {
    await fetchComunidade('abc');
    return fetchMock.mock.calls[0][1].headers;
  }

  it('sem SSR_API_TOKEN, não envia headers de SSR', async () => {
    vi.stubEnv('SSR_API_TOKEN', '');
    incoming.set('x-forwarded-for', '203.0.113.1');

    expect(await headersEnviados()).toBeUndefined();
  });

  it('envia o token e o primeiro IP do x-forwarded-for', async () => {
    vi.stubEnv('SSR_API_TOKEN', 'segredo');
    incoming.set('x-forwarded-for', ' 203.0.113.1 , 10.0.0.1');

    expect(await headersEnviados()).toEqual({
      'x-ssr-token': 'segredo',
      'x-ssr-client-ip': '203.0.113.1',
    });
  });

  it('usa o x-real-ip quando não há x-forwarded-for', async () => {
    vi.stubEnv('SSR_API_TOKEN', 'segredo');
    incoming.set('x-real-ip', '203.0.113.9');

    expect(await headersEnviados()).toEqual({
      'x-ssr-token': 'segredo',
      'x-ssr-client-ip': '203.0.113.9',
    });
  });

  it('sem IP do usuário, envia só o token', async () => {
    vi.stubEnv('SSR_API_TOKEN', 'segredo');

    expect(await headersEnviados()).toEqual({ 'x-ssr-token': 'segredo' });
  });
});
