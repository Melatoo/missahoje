import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POSITION_OPTIONS } from '../geolocation';
import { cidadeCookie, coordinatesCookies } from '../persistence';
import { useLocalizacaoStore } from './useLocalizacaoStore';

const lavras = { id: 'c1', nome: 'Lavras', estado: 'MG', slug: 'lavras' };
const PERMISSION_DENIED = 1;
const TIMEOUT = 3;

function cookieJar(initial: string[] = []) {
  const jar = new Map(initial.map((cookie) => {
    const [pair] = cookie.split(';');
    const index = pair.indexOf('=');
    return [pair.slice(0, index), pair.slice(index + 1)];
  }));
  const writes: string[] = [];
  return {
    writes,
    get cookie() {
      return [...jar].map(([name, value]) => `${name}=${value}`).join('; ');
    },
    set cookie(value: string) {
      writes.push(value);
      const [pair] = value.split(';');
      const index = pair.indexOf('=');
      jar.set(pair.slice(0, index), pair.slice(index + 1));
    },
  };
}

function stubGeolocation(result: { lat: number; lng: number } | { code: number }) {
  const getCurrentPosition = vi.fn((success: PositionCallback, failure: PositionErrorCallback, options?: PositionOptions) => {
    void options;
    if ('code' in result) {
      failure({ code: result.code, PERMISSION_DENIED } as GeolocationPositionError);
    } else {
      success({ coords: { latitude: result.lat, longitude: result.lng } } as GeolocationPosition);
    }
  });
  vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });
  return getCurrentPosition;
}

const initialState = useLocalizacaoStore.getState();

beforeEach(() => {
  useLocalizacaoStore.setState(initialState, true);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('inicialização da localização', () => {
  it('restaura coordenadas e cidade salvas em cookie', () => {
    vi.stubGlobal('document', cookieJar([
      ...coordinatesCookies({ lat: -21.245, lng: -44.999 }),
      cidadeCookie(lavras, 'manual'),
    ]));

    useLocalizacaoStore.getState().initialize(new URLSearchParams());

    expect(useLocalizacaoStore.getState()).toMatchObject({
      initialized: true,
      coordinates: { lat: -21.245, lng: -44.999 },
      cidade: lavras,
      origemCidade: 'manual',
      link: null,
    });
  });

  it('link compartilhado tem prioridade sobre o cookie e marca a sessão como vinda de link', () => {
    vi.stubGlobal('document', cookieJar([cidadeCookie(lavras, 'manual')]));

    useLocalizacaoStore.getState().initialize(new URLSearchParams('cidade=belo-horizonte&bairro=savassi'));

    expect(useLocalizacaoStore.getState()).toMatchObject({
      cidade: null,
      link: { cidadeSlug: 'belo-horizonte', bairro: 'savassi' },
    });
  });
});

describe('posição do usuário', () => {
  it('pede a posição sem alta precisão, trunca e salva em cookie', async () => {
    const jar = cookieJar();
    vi.stubGlobal('document', jar);
    const getCurrentPosition = stubGeolocation({ lat: -21.24567, lng: -44.99912 });

    await useLocalizacaoStore.getState().requestPosition();

    expect(getCurrentPosition.mock.calls[0][2]).toEqual(POSITION_OPTIONS);
    expect(POSITION_OPTIONS.enableHighAccuracy).toBe(false);
    expect(useLocalizacaoStore.getState()).toMatchObject({
      coordinates: { lat: -21.245, lng: -44.999 },
      permissionStatus: 'granted',
      isLocating: false,
    });
    expect(jar.cookie).toContain('user_lat=-21.245');
    expect(jar.cookie).toContain('user_lng=-44.999');
  });

  it('usar a própria localização encerra o modo link', async () => {
    vi.stubGlobal('document', cookieJar());
    stubGeolocation({ lat: -21.245, lng: -44.999 });
    useLocalizacaoStore.getState().initialize(new URLSearchParams('lat=-19.932&lng=-43.938'));

    await useLocalizacaoStore.getState().requestPosition();

    expect(useLocalizacaoStore.getState().link).toBeNull();
  });

  it('permissão negada vira estado denied, sem gravar nada', async () => {
    const jar = cookieJar();
    vi.stubGlobal('document', jar);
    stubGeolocation({ code: PERMISSION_DENIED });

    await useLocalizacaoStore.getState().requestPosition();

    expect(useLocalizacaoStore.getState()).toMatchObject({ permissionStatus: 'denied', coordinates: null, isLocating: false });
    expect(jar.writes).toEqual([]);
  });

  it('timeout não é negação: a permissão continua como estava', async () => {
    vi.stubGlobal('document', cookieJar());
    stubGeolocation({ code: TIMEOUT });

    await useLocalizacaoStore.getState().requestPosition();

    expect(useLocalizacaoStore.getState()).toMatchObject({ permissionStatus: 'prompt', positionUnavailable: true });
  });

  it('navegador sem geolocalização marca a posição como indisponível', async () => {
    vi.stubGlobal('document', cookieJar());
    vi.stubGlobal('navigator', {});

    await useLocalizacaoStore.getState().requestPosition();

    expect(useLocalizacaoStore.getState().positionUnavailable).toBe(true);
  });
});

describe('cidade selecionada', () => {
  it('guarda a cidade e a origem da escolha e persiste entre visitas', () => {
    const jar = cookieJar();
    vi.stubGlobal('document', jar);

    useLocalizacaoStore.getState().selectCidade(lavras, 'manual');
    useLocalizacaoStore.setState(initialState, true);
    useLocalizacaoStore.getState().initialize(new URLSearchParams());

    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: lavras, origemCidade: 'manual' });
  });
});
