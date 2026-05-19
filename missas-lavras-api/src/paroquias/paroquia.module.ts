import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paroquia } from './entities/paroquia.entity';
import { ParoquiaController } from './paroquia.controller';
import { ParoquiaService } from './paroquia.service';

@Module({
    imports: [TypeOrmModule.forFeature([Paroquia])],
    controllers: [ParoquiaController],
    providers: [ParoquiaService],
})
export class ParoquiaModule {}
