import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comunidade } from './entities/comunidade.entity';
import { ComunidadesController } from './comunidades.controller';
import { ComunidadesService } from './comunidades.service';

@Module({
    imports: [TypeOrmModule.forFeature([Comunidade])],
    controllers: [ComunidadesController],
    providers: [ComunidadesService],
})
export class ComunidadesModule {}
