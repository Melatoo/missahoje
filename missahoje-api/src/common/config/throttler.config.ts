import { ExecutionContext } from '@nestjs/common';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import { LerVariavel } from './ler-variavel';

export const THROTTLE_TTL_MS = 60_000;
export const THROTTLE_LIMIT = 120;
export const SSR_TOKEN_HEADER = 'x-ssr-token';

function sameToken(recebido: string, esperado: string): boolean {
    const a = Buffer.from(recebido);
    const b = Buffer.from(esperado);
    return a.length === b.length && timingSafeEqual(a, b);
}

export function throttlerOptions(ler: LerVariavel): ThrottlerModuleOptions {
    const token = ler('SSR_API_TOKEN')?.trim();

    return {
        throttlers: [{ ttl: THROTTLE_TTL_MS, limit: THROTTLE_LIMIT }],
        skipIf: (context: ExecutionContext) => {
            if (!token) {
                return false;
            }
            const recebido = context
                .switchToHttp()
                .getRequest<Request>()
                .header(SSR_TOKEN_HEADER);
            return recebido !== undefined && sameToken(recebido, token);
        },
    };
}
