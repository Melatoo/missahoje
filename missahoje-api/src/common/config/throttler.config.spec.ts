import { Controller, Get, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
    SSR_CLIENT_IP_HEADER,
    SSR_TOKEN_HEADER,
    THROTTLE_LIMIT,
    throttlerOptions,
} from './throttler.config';

@Controller('itens')
class ItensController {
    @Get()
    findAll() {
        return [];
    }
}

describe('throttlerOptions', () => {
    let app: INestApplication;
    let baseUrl: string;

    async function iniciar(token?: string) {
        const module = await Test.createTestingModule({
            imports: [ThrottlerModule.forRoot(throttlerOptions(() => token))],
            controllers: [ItensController],
            providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
        }).compile();

        app = module.createNestApplication();
        await app.listen(0);
        baseUrl = await app.getUrl();
    }

    function requisitar(headers: Record<string, string> = {}) {
        return fetch(`${baseUrl}/itens`, { headers }).then((r) => r.status);
    }

    async function esgotarLimite(headers: Record<string, string> = {}) {
        for (let i = 0; i < THROTTLE_LIMIT; i++) {
            expect(await requisitar(headers)).toBe(200);
        }
    }

    function doServidor(ip: string, token = 'segredo') {
        return { [SSR_TOKEN_HEADER]: token, [SSR_CLIENT_IP_HEADER]: ip };
    }

    afterEach(async () => {
        await app.close();
    });

    it('responde 429 depois do limite de requisições por minuto', async () => {
        await iniciar();

        await esgotarLimite();

        expect(await requisitar()).toBe(429);
    });

    it('conta pelo IP repassado quando o token do servidor confere', async () => {
        await iniciar('segredo');

        await esgotarLimite(doServidor('203.0.113.1'));

        expect(await requisitar(doServidor('203.0.113.1'))).toBe(429);
        expect(await requisitar(doServidor('203.0.113.2'))).toBe(200);
    });

    it('não separa o servidor do front de quem chama a API direto', async () => {
        await iniciar('segredo');

        await esgotarLimite(doServidor('203.0.113.1'));

        expect(await requisitar()).toBe(200);
    });

    it('ignora o IP repassado com token errado', async () => {
        await iniciar('segredo');

        await esgotarLimite(doServidor('203.0.113.1', 'outro'));

        expect(await requisitar(doServidor('203.0.113.2', 'outro'))).toBe(429);
    });

    it('ignora o IP repassado quando SSR_API_TOKEN não está configurado', async () => {
        await iniciar(undefined);

        await esgotarLimite(doServidor('203.0.113.1', ''));

        expect(await requisitar(doServidor('203.0.113.2', ''))).toBe(429);
    });

    it('ignora um IP repassado inválido', async () => {
        await iniciar('segredo');

        await esgotarLimite(doServidor('qualquer-coisa'));

        expect(await requisitar(doServidor('outra-coisa'))).toBe(429);
    });
});
