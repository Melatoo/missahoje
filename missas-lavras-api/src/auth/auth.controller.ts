import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService, AuthOutput } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Throttle({ default: { limit: 5, ttl: 900000 } })
    @Post('login')
    async login(@Body() input: LoginDto): Promise<AuthOutput> {
        return this.authService.authenticate(input);
    }
}
