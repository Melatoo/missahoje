import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ClearCacheInterceptor implements NestInterceptor {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap({
                next: () => {
                    const req = context.switchToHttp().getRequest<Request>();
                    if (
                        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
                    ) {
                        // Limpa sem segurar a resposta, como antes
                        void this.cacheManager.clear();
                    }
                },
            }),
        );
    }
}
