import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<Request & { user?: JwtPayload }>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token não encontrado');
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(
                token,
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                },
            );
            // Anexa o payload do token ao objeto da requisição para acesso posterior
            request.user = payload;
        } catch {
            throw new UnauthorizedException('Token inválido ou expirado');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
