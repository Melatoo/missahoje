import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissasService } from './missas.service';
import { MissasController } from './missas.controller';
import { HorarioMissa } from './entities/horario-missa.entity';

@Module({
    imports: [TypeOrmModule.forFeature([HorarioMissa])],
    controllers: [MissasController],
    providers: [MissasService],
})
export class MissasModule {}
