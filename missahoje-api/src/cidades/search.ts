// Letras acentuadas do português (minúsculas e maiúsculas) e suas versões sem acento,
// na mesma ordem: alimentam o translate() do Postgres, que tira o acento
// do nome sem depender da extensão unaccent.
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

export function escapeLike(term: string): string {
    return term.replace(/[\\%_]/g, '\\$&');
}
