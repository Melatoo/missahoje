import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import type { Request } from 'express';
import { LerVariavel } from './ler-variavel';

export const THROTTLE_TTL_MS = 60_000;
export const THROTTLE_LIMIT = 120;
export const SSR_TOKEN_HEADER = 'x-ssr-token';
export const SSR_CLIENT_IP_HEADER = 'x-ssr-client-ip';

function sameToken(recebido: string, esperado: string): boolean {
    const a = Buffer.from(recebido);
    const b = Buffer.from(esperado);
    return a.length === b.length && timingSafeEqual(a, b);
}

export function throttlerOptions(ler: LerVariavel): ThrottlerModuleOptions {
    const token = ler('SSR_API_TOKEN')?.trim();

    function ipRepassado(req: Request): string | undefined {
        const recebido = req.header(SSR_TOKEN_HEADER);
        if (!token || recebido === undefined || !sameToken(recebido, token)) {
            return undefined;
        }
        const ip = req.header(SSR_CLIENT_IP_HEADER)?.trim();
        return ip && isIP(ip) ? ip : undefined;
    }

    return {
        throttlers: [{ ttl: THROTTLE_TTL_MS, limit: THROTTLE_LIMIT }],
        getTracker: (req: Request) => ipRepassado(req) ?? req.ip ?? '',
    };
}
