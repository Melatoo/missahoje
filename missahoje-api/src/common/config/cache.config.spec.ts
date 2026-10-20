import {
    Controller,
    Get,
    INestApplication,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
    CACHE_MANAGER,
    CacheInterceptor,
    CacheModule,
} from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ClearCacheInterceptor } from '../interceptors/clear-cache.interceptor';
import { CACHE_TTL_MS, cacheConfig } from './cache.config';

const listar = jest.fn<{ id: number }[], []>();

@Controller('itens')
@UseInterceptors(CacheInterceptor, ClearCacheInterceptor)
class ItensController {
    @Get()
    findAll() {
        return listar();
    }

    @Post()
    create() {
        return { ok: true };
    }
}

describe('cacheConfig', () => {
    let app: INestApplication;
    let cache: Cache;
    let baseUrl: string;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [CacheModule.register(cacheConfig)],
            controllers: [ItensController],
        }).compile();

        app = module.createNestApplication();
        await app.listen(0);
        baseUrl = await app.getUrl();
        cache = app.get<Cache>(CACHE_MANAGER);

        listar.mockReset();
        listar.mockReturnValue([{ id: 1 }]);
    });

    afterEach(async () => {
        jest.restoreAllMocks();
        await app.close();
    });

    it('guarda e lê valores em memória, sem serviço externo', async () => {
        await cache.set('chave', { valor: 42 });

        await expect(cache.get('chave')).resolves.toEqual({ valor: 42 });
    });

    it('mantém a entrada por 5 minutos e a descarta depois', async () => {
        const agora = Date.now();
        const now = jest.spyOn(Date, 'now').mockReturnValue(agora);

        await cache.set('chave', 'valor');

        now.mockReturnValue(agora + CACHE_TTL_MS - 1);
        await expect(cache.get('chave')).resolves.toBe('valor');

        now.mockReturnValue(agora + CACHE_TTL_MS + 1);
        await expect(cache.get('chave')).resolves.toBeUndefined();
    });

    it('responde GETs repetidos a partir do cache', async () => {
        const primeira = await fetch(`${baseUrl}/itens`);
        const segunda = await fetch(`${baseUrl}/itens`);

        await expect(primeira.json()).resolves.toEqual([{ id: 1 }]);
        await expect(segunda.json()).resolves.toEqual([{ id: 1 }]);
        expect(listar).toHaveBeenCalledTimes(1);
    });

    it('invalida o cache após uma escrita', async () => {
        await fetch(`${baseUrl}/itens`);
        await fetch(`${baseUrl}/itens`, { method: 'POST' });
        listar.mockReturnValue([{ id: 1 }, { id: 2 }]);

        const resposta = await fetch(`${baseUrl}/itens`);

        await expect(resposta.json()).resolves.toEqual([{ id: 1 }, { id: 2 }]);
        expect(listar).toHaveBeenCalledTimes(2);
    });

    it('volta a consultar a fonte depois que o TTL expira', async () => {
        const agora = Date.now();
        const now = jest.spyOn(Date, 'now').mockReturnValue(agora);
        await fetch(`${baseUrl}/itens`);

        now.mockReturnValue(agora + CACHE_TTL_MS + 1);
        await fetch(`${baseUrl}/itens`);

        expect(listar).toHaveBeenCalledTimes(2);
    });
});
