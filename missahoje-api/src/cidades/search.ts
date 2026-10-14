import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

const MINUSCULAS_ACENTUADAS = 'áàâãäéèêëíìîïóòôõöúùûüçñ';
export const ACENTUADAS =
    MINUSCULAS_ACENTUADAS + MINUSCULAS_ACENTUADAS.toUpperCase();
export const SEM_ACENTO = removeAccents(ACENTUADAS);

function removeAccents(text: string): string {
    return text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function normalizeSearch(term: string): string {
    return removeAccents(term).toLowerCase().trim().replace(/\s+/g, ' ');
}

export function toSlug(term: string): string {
    return normalizeSearch(term).replace(/ /g, '-');
}

export function escapeLike(term: string): string {
    return term.replace(/[\\%_]/g, '\\$&');
}

export function filterByNome<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    nome = '',
): SelectQueryBuilder<T> {
    const termo = normalizeSearch(nome);
    if (!termo) {
        return qb;
    }

    const { alias } = qb;
    return qb.andWhere(
        new Brackets((where) => {
            where
                .where(
                    `lower(translate(${alias}.nome, :acentuadas, :semAcento)) LIKE :nome`,
                )
                .orWhere(`${alias}.slug LIKE :slug`);
        }),
        {
            acentuadas: ACENTUADAS,
            semAcento: SEM_ACENTO,
            nome: `%${escapeLike(termo)}%`,
            slug: `%${escapeLike(toSlug(termo))}%`,
        },
    );
}
