import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissasService } from './missas.service';
import { MissasRepository } from './missas.repository';
import { MissasController } from './missas.controller';
import { HorarioMissa } from './entities/horario-missa.entity';

@Module({
    imports: [TypeOrmModule.forFeature([HorarioMissa])],
    controllers: [MissasController],
    providers: [MissasService, MissasRepository],
})
export class MissasModule {}
