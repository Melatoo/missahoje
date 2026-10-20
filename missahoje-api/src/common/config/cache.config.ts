import { CacheModuleOptions } from '@nestjs/cache-manager';

export const CACHE_TTL_MS = 5 * 60 * 1000;

export const cacheConfig: CacheModuleOptions = {
    isGlobal: true,
    ttl: CACHE_TTL_MS,
};
