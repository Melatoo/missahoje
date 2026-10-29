import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { throttlerOptions } from '../common/config/throttler.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let app: INestApplication;
    let baseUrl: string;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ThrottlerModule.forRoot(throttlerOptions(() => undefined)),
            ],
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        authenticate: jest
                            .fn()
                            .mockResolvedValue({ access_token: 't' }),
                    },
                },
                { provide: APP_GUARD, useClass: ThrottlerGuard },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.listen(0);
        baseUrl = await app.getUrl();
    });

    afterEach(async () => {
        await app.close();
    });

    function login() {
        return fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                senha: 'segredo',
            }),
        }).then((r) => r.status);
    }

    it('responde 429 na sexta tentativa de login', async () => {
        for (let i = 0; i < 5; i++) {
            expect(await login()).toBe(201);
        }

        expect(await login()).toBe(429);
    });
});
