import { create } from 'zustand';
import { findCidadeBySlug } from '../cidades';
import { getCurrentPosition } from '../geolocation';
import { cidadeCookie, coordinatesCookies, readLocalizacao } from '../persistence';
import { resolveInitialLocation, type SearchParamsLike } from '../resolveInitialLocation';
import type { CidadeSelecionada, Coordinates, OrigemCidade, PermissionStatus } from '../types';

export interface LinkCompartilhado {
  cidadeSlug: string | null;
  bairro: string | null;
}

interface LocalizacaoState {
  initialized: boolean;
  coordinates: Coordinates | null;
  permissionStatus: PermissionStatus;
  positionUnavailable: boolean;
  isLocating: boolean;
  cidade: CidadeSelecionada | null;
  origemCidade: OrigemCidade | null;
  link: LinkCompartilhado | null;

  initialize: (params: SearchParamsLike) => void;
  requestPosition: () => Promise<void>;
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

export const useLocalizacaoStore = create<LocalizacaoState>((set, get) => ({
  initialized: false,
  coordinates: null,
  permissionStatus: 'prompt',
  positionUnavailable: false,
  isLocating: false,
  cidade: null,
  origemCidade: null,
  link: null,

  initialize: (params) => {
    const salva = readLocalizacao(readCookieHeader());
    const inicial = resolveInitialLocation(params, salva);

    if (inicial.origem === 'url') {
      const cidadeSalva =
        inicial.cidadeSlug && salva.cidade ? findCidadeBySlug([salva.cidade], inicial.cidadeSlug) : null;
      set({
        initialized: true,
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
        coordinates: inicial.coordinates,
        cidade: inicial.cidade,
        origemCidade: inicial.origemCidade,
        link: null,
      });
      return;
    }

    set({ initialized: true, link: null });
  },

  requestPosition: async () => {
    if (get().isLocating) return;
    set({ isLocating: true });

    const result = await getCurrentPosition();

    if (result.status === 'granted') {
      writeCookies(coordinatesCookies(result.coordinates));
      set({
        coordinates: result.coordinates,
        permissionStatus: 'granted',
        positionUnavailable: false,
        isLocating: false,
        link: null,
      });
      return;
    }

    if (result.status === 'denied') {
      set({ permissionStatus: 'denied', isLocating: false });
      return;
    }

    set({ positionUnavailable: true, isLocating: false });
  },

  selectCidade: (cidade, origem) => {
    writeCookies([cidadeCookie(cidade, origem)]);
    set({ cidade, origemCidade: origem, link: null });
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
}));
