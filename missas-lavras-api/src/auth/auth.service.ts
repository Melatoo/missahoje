import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import bcryptjs from 'bcryptjs';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

import { LoginDto } from './dto/login.dto';

export type AuthOutput = {
    access_token: string;
};

export type JwtPayload = {
    sub: string;
    email: string;
    role: string;
};

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService,
    ) {}

    /**
     * Valida as credenciais do usuário.
     * Retorna o usuário (sem a senha) se as credenciais forem válidas, ou null.
     */
    async validateUser(input: LoginDto): Promise<Omit<Usuario, 'senha'> | null> {
        const usuario = await this.usuariosService.findByEmail(input.email);

        if (usuario?.ativo) {
            const isMatch = await bcryptjs.compare(input.senha, usuario.senha);
            if (isMatch) {
                // Remove a senha do objeto por segurança antes de retorná-lo
                const { senha, ...result } = usuario;
                return result;
            }
        }

        return null;
    }

    /**
     * Orquestra o fluxo de autenticação recebendo email e senha.
     */
    async authenticate(input: LoginDto): Promise<AuthOutput> {
        const usuario = await this.validateUser(input);

        if (!usuario) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        return this.signIn(usuario);
    }

    /**
     * Gera o token JWT para um usuário válido.
     */
    async signIn(user: Omit<Usuario, 'senha'>): Promise<AuthOutput> {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
