import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { LerVariavel } from '../../database/typeorm.config';

export function corsOptions(ler: LerVariavel): CorsOptions {
    const origens = (ler('CORS_ORIGIN') ?? '')
        .split(',')
        .map((origem) => origem.trim())
        .filter(Boolean);

    if (origens.length === 0) {
        return {};
    }

    return { origin: origens };
}
