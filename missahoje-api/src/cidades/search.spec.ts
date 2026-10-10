import { ACENTUADAS, escapeLike, normalizeSearch, SEM_ACENTO } from './search';

describe('normalizeSearch', () => {
    it('ignora acento e caixa', () => {
        expect(normalizeSearch('São JOÃO')).toBe('sao joao');
    });

    it('apara e junta espaços repetidos', () => {
        expect(normalizeSearch('  sao   joao  ')).toBe('sao joao');
    });

    it('termo só de espaços vira vazio', () => {
        expect(normalizeSearch('   ')).toBe('');
    });
});

describe('escapeLike', () => {
    it('escapa os curingas do LIKE para buscarem literalmente', () => {
        expect(escapeLike('50%_a\\b')).toBe('50\\%\\_a\\\\b');
    });

    it('não mexe em texto comum', () => {
        expect(escapeLike('lavras')).toBe('lavras');
    });
});

describe('ACENTUADAS e SEM_ACENTO', () => {
    it('casam letra a letra, como o translate() do Postgres exige', () => {
        expect(SEM_ACENTO).toHaveLength(ACENTUADAS.length);
        expect(SEM_ACENTO).toMatch(/^[a-zA-Z]+$/);
        expect(ACENTUADAS).toContain('Á');
    });
});
