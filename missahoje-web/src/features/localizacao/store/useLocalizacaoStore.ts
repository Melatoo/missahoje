import { create } from 'zustand';
import { findCidadeBySlug } from '../cidades';
import { getCurrentPosition, isGeolocationAvailable } from '../geolocation';
import { cidadeCookie, coordinatesCookies, readLocalizacao } from '../persistence';
import { resolveInitialLocation, type SearchParamsLike } from '../resolveInitialLocation';
import type {
  CidadeSelecionada,
  Coordinates,
  Locating,
  LocationFeedback,
  OrigemCidade,
  PermissionStatus,
} from '../types';

export interface LinkCompartilhado {
  cidadeSlug: string | null;
  bairro: string | null;
}

interface LocalizacaoState {
  initialized: boolean;
  geolocationAvailable: boolean;
  coordinates: Coordinates | null;
  permissionStatus: PermissionStatus;
  locating: Locating | null;
  locationFeedback: LocationFeedback | null;
  cidade: CidadeSelecionada | null;
  origemCidade: OrigemCidade | null;
  link: LinkCompartilhado | null;

  initialize: (params: SearchParamsLike) => void;
  requestPosition: () => Promise<void>;
  syncPermission: (status: PermissionStatus) => void;
  applyNearestCity: (cidade: CidadeSelecionada | null) => boolean;
  failNearestCity: () => void;
  selectCidade: (cidade: CidadeSelecionada, origem: OrigemCidade) => void;
  resolveLink: (cidades: CidadeSelecionada[]) => void;
  abandonLink: () => void;
}

function readCookieHeader(): string {
  return typeof document === 'undefined' ? '' : document.cookie;
}

function writeCookies(cookies: string[]) {
  if (typeof document === 'undefined') return;
  for (const cookie of cookies) document.cookie = cookie;
}

function savedCityWithoutLink(): Pick<LocalizacaoState, 'cidade' | 'origemCidade' | 'link'> {
  const { cidade, origemCidade } = readLocalizacao(readCookieHeader());
  return { cidade, origemCidade, link: null };
}

function followsPosition(state: LocalizacaoState): boolean {
  if (!state.initialized || !state.geolocationAvailable) return false;
  if (state.origemCidade === 'gps') return true;
  return state.cidade === null && state.link === null;
}

function explicitFeedback(locating: Locating | null, feedback: LocationFeedback) {
  return locating?.explicit ? { locationFeedback: feedback } : {};
}

export const useLocalizacaoStore = create<LocalizacaoState>((set, get) => {
  const locate = async (explicit: boolean) => {
    if (get().locating) return;
    const locating: Locating = { explicit, startedAt: Date.now(), coordinates: null };
    set({ locating, ...(explicit ? { locationFeedback: null } : {}) });

    const result = await getCurrentPosition();
    const current = get().locating === locating;

    if (result.status === 'granted') {
      writeCookies(coordinatesCookies(result.coordinates));
      set({ coordinates: result.coordinates, permissionStatus: 'granted' });
      if (current) {
        set({
          locating: { ...locating, coordinates: result.coordinates },
          ...(explicit ? { link: null } : {}),
        });
      }
      return;
    }

    if (result.status === 'denied') {
      set({ permissionStatus: 'denied' });
      if (current) set({ locating: null, ...explicitFeedback(locating, 'denied') });
      return;
    }

    if (current) set({ locating: null, ...explicitFeedback(locating, 'unavailable') });
  };

  return {
    initialized: false,
    geolocationAvailable: false,
    coordinates: null,
    permissionStatus: 'prompt',
    locating: null,
    locationFeedback: null,
    cidade: null,
    origemCidade: null,
    link: null,

    initialize: (params) => {
      const salva = readLocalizacao(readCookieHeader());
      const inicial = resolveInitialLocation(params, salva);
      const geolocationAvailable = isGeolocationAvailable();

      if (inicial.origem === 'url') {
        const cidadeSalva =
          inicial.cidadeSlug && salva.cidade ? findCidadeBySlug([salva.cidade], inicial.cidadeSlug) : null;
        set({
          initialized: true,
          geolocationAvailable,
          coordinates: inicial.coordinates,
          cidade: cidadeSalva,
          origemCidade: cidadeSalva ? salva.origemCidade : null,
          link: { cidadeSlug: inicial.cidadeSlug, bairro: inicial.bairro },
        });
        return;
      }

      if (inicial.origem === 'cookie') {
        set({
          initialized: true,
          geolocationAvailable,
          coordinates: inicial.coordinates,
          cidade: inicial.cidade,
          origemCidade: inicial.origemCidade,
          link: null,
        });
        return;
      }

      set({ initialized: true, geolocationAvailable, link: null });
    },

    requestPosition: () => locate(true),

    syncPermission: (status) => {
      const previous = get().permissionStatus;
      set({ permissionStatus: status });
      if (status === 'granted' && previous !== 'granted' && followsPosition(get())) void locate(false);
    },

    applyNearestCity: (cidade) => {
      const { locating, cidade: atual, selectCidade } = get();
      if (!locating?.coordinates) return false;

      if (!cidade) {
        set({ locating: null, ...explicitFeedback(locating, 'not-found') });
        return false;
      }

      const applied = locating.explicit || atual?.id !== cidade.id;
      if (applied) selectCidade(cidade, 'gps');
      set({ locating: null });
      return applied;
    },

    failNearestCity: () => {
      const { locating } = get();
      if (!locating?.coordinates) return;
      set({ locating: null, ...explicitFeedback(locating, 'error') });
    },

    selectCidade: (cidade, origem) => {
      writeCookies([cidadeCookie(cidade, origem)]);
      set({ cidade, origemCidade: origem, link: null, locating: null, locationFeedback: null });
    },

    resolveLink: (cidades) => {
      const { link, cidade } = get();
      if (!link?.cidadeSlug || cidade) return;

      const encontrada = findCidadeBySlug(cidades, link.cidadeSlug);
      if (encontrada) {
        set({ cidade: encontrada, origemCidade: null });
        return;
      }

      set(savedCityWithoutLink());
    },

    abandonLink: () => {
      const { link, cidade } = get();
      if (!link?.cidadeSlug || cidade) return;

      const salva = savedCityWithoutLink();
      if (salva.cidade) set(salva);
    },
  };
});
