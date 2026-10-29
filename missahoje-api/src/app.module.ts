import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MissasModule } from './missas/missas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ParoquiaModule } from './paroquias/paroquia.module';
import { ComunidadesModule } from './comunidades/comunidades.module';
import { AuthModule } from './auth/auth.module';
import { CidadesModule } from './cidades/cidades.module';
import { cacheConfig } from './common/config/cache.config';
import { throttlerOptions } from './common/config/throttler.config';
import { typeOrmOptions } from './database/typeorm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                throttlerOptions((nome) => configService.get<string>(nome)),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ...typeOrmOptions((nome) => configService.get<string>(nome)),
                migrationsRun: true,
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
    providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
