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

  it('link da mesma cidade do cookie já começa resolvido, sem esperar a lista de cidades', () => {
    vi.stubGlobal('document', cookieJar([cidadeCookie(lavras, 'manual')]));

    useLocalizacaoStore.getState().initialize(new URLSearchParams('cidade=Lavras&dia=sexta'));

    expect(useLocalizacaoStore.getState()).toMatchObject({
      cidade: lavras,
      origemCidade: 'manual',
      link: { cidadeSlug: 'Lavras', bairro: null },
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
      locating: { explicit: true, coordinates: { lat: -21.245, lng: -44.999 } },
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

    expect(useLocalizacaoStore.getState()).toMatchObject({
      permissionStatus: 'denied',
      coordinates: null,
      locating: null,
      locationFeedback: 'denied',
    });
    expect(jar.writes).toEqual([]);
  });

  it('timeout não é negação: a permissão continua como estava', async () => {
    vi.stubGlobal('document', cookieJar());
    stubGeolocation({ code: TIMEOUT });

    await useLocalizacaoStore.getState().requestPosition();

    expect(useLocalizacaoStore.getState()).toMatchObject({
      permissionStatus: 'prompt',
      locating: null,
      locationFeedback: 'unavailable',
    });
  });

  it('navegador sem geolocalização marca a posição como indisponível', async () => {
    vi.stubGlobal('document', cookieJar());
    vi.stubGlobal('navigator', {});

    await useLocalizacaoStore.getState().requestPosition();

    expect(useLocalizacaoStore.getState().locationFeedback).toBe('unavailable');
  });

  it('um pedido novo apaga o aviso do pedido anterior', async () => {
    vi.stubGlobal('document', cookieJar());
    stubGeolocation({ code: TIMEOUT });
    await useLocalizacaoStore.getState().requestPosition();
    stubGeolocation({ lat: -21.245, lng: -44.999 });

    await useLocalizacaoStore.getState().requestPosition();

    expect(useLocalizacaoStore.getState().locationFeedback).toBeNull();
  });

  it('em HTTP ou sem a API, a geolocalização não é oferecida', () => {
    vi.stubGlobal('document', cookieJar());
    vi.stubGlobal('navigator', {});

    useLocalizacaoStore.getState().initialize(new URLSearchParams());

    expect(useLocalizacaoStore.getState().geolocationAvailable).toBe(false);
  });
});

describe('cidade pela posição', () => {
  const ijaci = { id: 'c3', nome: 'Ijaci', estado: 'MG', slug: 'ijaci-mg' };

  async function locateExplicitly() {
    stubGeolocation({ lat: -21.245, lng: -44.999 });
    await useLocalizacaoStore.getState().requestPosition();
  }

  it('o clique no botão troca para a cidade mais próxima e lembra que veio do GPS', async () => {
    const jar = cookieJar([cidadeCookie(lavras, 'manual')]);
    vi.stubGlobal('document', jar);
    useLocalizacaoStore.getState().initialize(new URLSearchParams());
    await locateExplicitly();

    const changed = useLocalizacaoStore.getState().applyNearestCity(ijaci);

    expect(changed).toBe(true);
    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: ijaci, origemCidade: 'gps', locating: null });
    expect(jar.cookie).toContain(encodeURIComponent('"origem":"gps"'));
  });

  it('o clique que confirma a mesma cidade passa a origem para GPS e aplica a cidade', async () => {
    vi.stubGlobal('document', cookieJar([cidadeCookie(lavras, 'manual')]));
    useLocalizacaoStore.getState().initialize(new URLSearchParams());
    await locateExplicitly();

    const applied = useLocalizacaoStore.getState().applyNearestCity(lavras);

    expect(applied).toBe(true);
    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: lavras, origemCidade: 'gps' });
  });

  it('escolha no seletor durante a busca da cidade vence o resultado do GPS', async () => {
    vi.stubGlobal('document', cookieJar());
    useLocalizacaoStore.getState().initialize(new URLSearchParams());
    await locateExplicitly();

    useLocalizacaoStore.getState().selectCidade(lavras, 'manual');
    const applied = useLocalizacaoStore.getState().applyNearestCity(ijaci);

    expect(applied).toBe(false);
    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: lavras, origemCidade: 'manual', locating: null });
  });

  it('escolha no seletor enquanto o navegador ainda busca a posição cancela a busca', async () => {
    vi.stubGlobal('document', cookieJar());
    let resolvePosition: (position: GeolocationPosition) => void = () => {};
    vi.stubGlobal('navigator', {
      geolocation: { getCurrentPosition: (success: PositionCallback) => { resolvePosition = success; } },
    });
    useLocalizacaoStore.getState().initialize(new URLSearchParams());

    const pending = useLocalizacaoStore.getState().requestPosition();
    useLocalizacaoStore.getState().selectCidade(lavras, 'manual');
    resolvePosition({ coords: { latitude: -21.245, longitude: -44.999 } } as GeolocationPosition);
    await pending;

    expect(useLocalizacaoStore.getState()).toMatchObject({
      cidade: lavras,
      origemCidade: 'manual',
      locating: null,
      permissionStatus: 'granted',
    });
  });

  it('fora das cidades atendidas, mantém a cidade e avisa', async () => {
    vi.stubGlobal('document', cookieJar([cidadeCookie(lavras, 'manual')]));
    useLocalizacaoStore.getState().initialize(new URLSearchParams());
    await locateExplicitly();

    useLocalizacaoStore.getState().applyNearestCity(null);

    expect(useLocalizacaoStore.getState()).toMatchObject({
      cidade: lavras,
      origemCidade: 'manual',
      locating: null,
      locationFeedback: 'not-found',
    });
  });

  it('falha ao buscar a cidade avisa e libera o botão', async () => {
    vi.stubGlobal('document', cookieJar());
    useLocalizacaoStore.getState().initialize(new URLSearchParams());
    await locateExplicitly();

    useLocalizacaoStore.getState().failNearestCity();

    expect(useLocalizacaoStore.getState()).toMatchObject({ locating: null, locationFeedback: 'error' });
  });

  it('sem posição em andamento, a resposta da cidade é ignorada', () => {
    vi.stubGlobal('document', cookieJar());
    useLocalizacaoStore.getState().initialize(new URLSearchParams());

    expect(useLocalizacaoStore.getState().applyNearestCity(ijaci)).toBe(false);
    expect(useLocalizacaoStore.getState().cidade).toBeNull();
  });

  it('escolher no seletor apaga o aviso da localização', async () => {
    vi.stubGlobal('document', cookieJar());
    stubGeolocation({ code: TIMEOUT });
    await useLocalizacaoStore.getState().requestPosition();

    useLocalizacaoStore.getState().selectCidade(lavras, 'manual');

    expect(useLocalizacaoStore.getState().locationFeedback).toBeNull();
  });
});

describe('permissão já concedida em visita anterior', () => {
  const ijaci = { id: 'c3', nome: 'Ijaci', estado: 'MG', slug: 'ijaci-mg' };

  function openWith(cookies: string[], query = '') {
    vi.stubGlobal('document', cookieJar(cookies));
    const getCurrentPosition = stubGeolocation({ lat: -21.18, lng: -44.93 });
    useLocalizacaoStore.getState().initialize(new URLSearchParams(query));
    return getCurrentPosition;
  }

  it('sem cidade, busca a posição sem pedir nada ao usuário', async () => {
    const getCurrentPosition = openWith([]);

    useLocalizacaoStore.getState().syncPermission('granted');

    expect(getCurrentPosition).toHaveBeenCalledOnce();
    await vi.waitFor(() =>
      expect(useLocalizacaoStore.getState().locating).toMatchObject({ explicit: false, coordinates: { lat: -21.18, lng: -44.93 } }),
    );
  });

  it('cidade que veio do GPS é corrigida quando o usuário mudou de cidade', async () => {
    openWith([cidadeCookie(lavras, 'gps')]);
    useLocalizacaoStore.getState().syncPermission('granted');
    await vi.waitFor(() => expect(useLocalizacaoStore.getState().locating?.coordinates).not.toBeNull());

    const changed = useLocalizacaoStore.getState().applyNearestCity(ijaci);

    expect(changed).toBe(true);
    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: ijaci, origemCidade: 'gps' });
  });

  it('em segundo plano, ficar fora das cidades atendidas não gera aviso', async () => {
    openWith([cidadeCookie(lavras, 'gps')]);
    useLocalizacaoStore.getState().syncPermission('granted');
    await vi.waitFor(() => expect(useLocalizacaoStore.getState().locating?.coordinates).not.toBeNull());

    useLocalizacaoStore.getState().applyNearestCity(null);

    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: lavras, locating: null, locationFeedback: null });
  });

  it('em segundo plano, confirmar a mesma cidade não mexe em nada', async () => {
    openWith([cidadeCookie(lavras, 'gps')]);
    useLocalizacaoStore.getState().syncPermission('granted');
    await vi.waitFor(() => expect(useLocalizacaoStore.getState().locating?.coordinates).not.toBeNull());

    expect(useLocalizacaoStore.getState().applyNearestCity(lavras)).toBe(false);
    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: lavras, locating: null });
  });

  it('não passa por cima de uma cidade escolhida no seletor', () => {
    const getCurrentPosition = openWith([cidadeCookie(lavras, 'manual')]);

    useLocalizacaoStore.getState().syncPermission('granted');

    expect(getCurrentPosition).not.toHaveBeenCalled();
    expect(useLocalizacaoStore.getState().permissionStatus).toBe('granted');
  });

  it('não passa por cima de um link compartilhado', () => {
    const getCurrentPosition = openWith([], 'cidade=belo-horizonte');

    useLocalizacaoStore.getState().syncPermission('granted');

    expect(getCurrentPosition).not.toHaveBeenCalled();
  });

  it('permissão concedida pelo próprio clique não dispara uma segunda busca', async () => {
    const getCurrentPosition = openWith([]);
    await useLocalizacaoStore.getState().requestPosition();

    useLocalizacaoStore.getState().syncPermission('granted');

    expect(getCurrentPosition).toHaveBeenCalledOnce();
  });

  it('negada nas configurações, apenas registra o estado', () => {
    const getCurrentPosition = openWith([]);

    useLocalizacaoStore.getState().syncPermission('denied');

    expect(getCurrentPosition).not.toHaveBeenCalled();
    expect(useLocalizacaoStore.getState()).toMatchObject({ permissionStatus: 'denied', locationFeedback: null });
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

describe('cidade do link compartilhado', () => {
  const bh = { id: 'c2', nome: 'Belo Horizonte', estado: 'MG', slug: 'belo-horizonte' };

  it('resolve o slug do link sem trocar a cidade salva do visitante', () => {
    const jar = cookieJar([cidadeCookie(lavras, 'manual')]);
    vi.stubGlobal('document', jar);
    useLocalizacaoStore.getState().initialize(new URLSearchParams('cidade=belo-horizonte'));

    useLocalizacaoStore.getState().resolveLink([lavras, bh]);

    expect(useLocalizacaoStore.getState()).toMatchObject({
      cidade: bh,
      link: { cidadeSlug: 'belo-horizonte', bairro: null },
    });
    expect(jar.writes).toEqual([]);
  });

  it('slug desconhecido volta para a cidade salva em cookie e encerra o modo link', () => {
    vi.stubGlobal('document', cookieJar([cidadeCookie(lavras, 'manual')]));
    useLocalizacaoStore.getState().initialize(new URLSearchParams('cidade=atlantida'));

    useLocalizacaoStore.getState().resolveLink([lavras, bh]);

    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: lavras, origemCidade: 'manual', link: null });
  });

  it('slug desconhecido sem cidade salva deixa o visitante escolher', () => {
    vi.stubGlobal('document', cookieJar());
    useLocalizacaoStore.getState().initialize(new URLSearchParams('cidade=atlantida'));

    useLocalizacaoStore.getState().resolveLink([lavras, bh]);

    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: null, link: null });
  });

  it('sem a lista de cidades, abandonar o link volta para a cidade salva em cookie', () => {
    const jar = cookieJar([cidadeCookie(lavras, 'manual')]);
    vi.stubGlobal('document', jar);
    useLocalizacaoStore.getState().initialize(new URLSearchParams('cidade=belo-horizonte'));

    useLocalizacaoStore.getState().abandonLink();

    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: lavras, origemCidade: 'manual', link: null });
    expect(jar.writes).toEqual([]);
  });

  it('sem cidade salva, abandonar o link mantém o modo link para tentar de novo', () => {
    vi.stubGlobal('document', cookieJar());
    useLocalizacaoStore.getState().initialize(new URLSearchParams('cidade=belo-horizonte'));

    useLocalizacaoStore.getState().abandonLink();

    expect(useLocalizacaoStore.getState()).toMatchObject({
      cidade: null,
      link: { cidadeSlug: 'belo-horizonte', bairro: null },
    });
  });

  it('escolher uma cidade no seletor encerra o modo link e salva a escolha', () => {
    const jar = cookieJar();
    vi.stubGlobal('document', jar);
    useLocalizacaoStore.getState().initialize(new URLSearchParams('cidade=belo-horizonte'));
    useLocalizacaoStore.getState().resolveLink([lavras, bh]);

    useLocalizacaoStore.getState().selectCidade(lavras, 'manual');

    expect(useLocalizacaoStore.getState()).toMatchObject({ cidade: lavras, origemCidade: 'manual', link: null });
    expect(jar.cookie).toContain('cidade=');
  });
});
