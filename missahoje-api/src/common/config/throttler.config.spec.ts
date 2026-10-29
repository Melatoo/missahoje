import { Controller, Get, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
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

    async function esgotarLimite(headers: Record<string, string> = {}) {
        for (let i = 0; i < THROTTLE_LIMIT; i++) {
            const resposta = await fetch(`${baseUrl}/itens`, { headers });
            expect(resposta.status).toBe(200);
        }
        return fetch(`${baseUrl}/itens`, { headers });
    }

    afterEach(async () => {
        await app.close();
    });

    it('responde 429 depois do limite de requisições por minuto', async () => {
        await iniciar();

        const resposta = await esgotarLimite();

        expect(resposta.status).toBe(429);
    });

    it('não limita quem envia o token do servidor do front', async () => {
        await iniciar('segredo');

        const resposta = await esgotarLimite({ [SSR_TOKEN_HEADER]: 'segredo' });

        expect(resposta.status).toBe(200);
    });

    it('limita quem envia um token errado', async () => {
        await iniciar('segredo');

        const resposta = await esgotarLimite({ [SSR_TOKEN_HEADER]: 'outro' });

        expect(resposta.status).toBe(429);
    });

    it('ignora o header quando SSR_API_TOKEN não está configurado', async () => {
        await iniciar(undefined);

        const resposta = await esgotarLimite({ [SSR_TOKEN_HEADER]: '' });

        expect(resposta.status).toBe(429);
    });
});
