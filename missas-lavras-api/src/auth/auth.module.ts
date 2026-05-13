import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsuariosModule } from "../usuarios/usuarios.module";

@Module({
    imports: [
        UsuariosModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'chave-secreta-desenvolvimento',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }