import { distanceKm, findNearest, MAX_DISTANCE_KM } from './nearest';

const lavras = { nome: 'Lavras', latitude: -21.2456, longitude: -44.9997 };
const ijaci = { nome: 'Ijaci', latitude: -21.1706, longitude: -44.9244 };
const bh = { nome: 'Belo Horizonte', latitude: -19.9167, longitude: -43.9345 };
const semCentro = { nome: 'Sem centro', latitude: null, longitude: null };

describe('distanceKm', () => {
    it('mede a distância entre Lavras e Belo Horizonte em linha reta', () => {
        const km = distanceKm(
            { lat: lavras.latitude, lng: lavras.longitude },
            { lat: bh.latitude, lng: bh.longitude },
        );

        expect(km).toBeGreaterThan(180);
        expect(km).toBeLessThan(190);
    });

    it('é zero para o mesmo ponto', () => {
        expect(
            distanceKm(
                { lat: -21.245, lng: -44.999 },
                { lat: -21.245, lng: -44.999 },
            ),
        ).toBe(0);
    });
});

describe('findNearest', () => {
    it('escolhe a cidade de centro mais próximo', () => {
        const noCentroDeLavras = { lat: -21.24, lng: -45.0 };

        expect(findNearest([ijaci, lavras, bh], noCentroDeLavras)).toBe(lavras);
    });

    it('escolhe a vizinha quando a posição está mais perto dela', () => {
        const pertoDeIjaci = { lat: -21.18, lng: -44.93 };

        expect(findNearest([lavras, ijaci], pertoDeIjaci)).toBe(ijaci);
    });

    it('ignora cidades sem centro cadastrado', () => {
        expect(
            findNearest([semCentro, lavras], { lat: -21.245, lng: -44.999 }),
        ).toBe(lavras);
    });

    it(`não devolve cidade a mais de ${MAX_DISTANCE_KM} km`, () => {
        const emSaoPaulo = { lat: -23.55, lng: -46.633 };

        expect(findNearest([lavras, bh], emSaoPaulo)).toBeNull();
    });

    it('sem cidades, não devolve nada', () => {
        expect(findNearest([], { lat: -21.245, lng: -44.999 })).toBeNull();
    });
});
