import { Body, Controller, Post } from "@nestjs/common";
import { AuthService, AuthOutput } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    async login(@Body() input: LoginDto): Promise<AuthOutput> {
        return this.authService.authenticate(input);
    }
}