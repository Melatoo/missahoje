import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { LerVariavel } from './ler-variavel';

export function corsOptions(ler: LerVariavel): CorsOptions {
    const origens = (ler('CORS_ORIGIN') ?? '')
        .split(',')
        .map((origem) => origem.trim().replace(/\/+$/, ''))
        .filter(Boolean);

    if (origens.length === 0) {
        return {};
    }

    return { origin: origens };
}
