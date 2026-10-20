import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { MissasModule } from './missas/missas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ParoquiaModule } from './paroquias/paroquia.module';
import { ComunidadesModule } from './comunidades/comunidades.module';
import { AuthModule } from './auth/auth.module';
import { CidadesModule } from './cidades/cidades.module';
import { cacheConfig } from './common/config/cache.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 20,
            },
        ]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASS'),
                database: configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        CacheModule.register(cacheConfig),
        MissasModule,
        UsuariosModule,
        ParoquiaModule,
        ComunidadesModule,
        AuthModule,
        CidadesModule,
    ],
})
export class AppModule {}
