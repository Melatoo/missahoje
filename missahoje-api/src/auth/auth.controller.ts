import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Throttle({ default: { limit: 5, ttl: 900000 } })
    @ApiOperation({ summary: 'Autentica o usuário e retorna o token JWT' })
    @Post('login')
    async login(@Body() input: LoginDto): Promise<AccessTokenDto> {
        return this.authService.authenticate(input);
    }
}
