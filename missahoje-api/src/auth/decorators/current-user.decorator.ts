import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../auth.service';

/**
 * Decorator para recuperar o usuário atualmente logado a partir da requisição.
 * Deve ser usado em rotas protegidas pelo AuthGuard.
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtPayload => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
