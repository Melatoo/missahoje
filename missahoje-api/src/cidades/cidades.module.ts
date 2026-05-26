import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CidadesService } from './cidades.service';
import { CidadesController } from './cidades.controller';
import { Cidade } from './entities/cidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cidade])],
  controllers: [CidadesController],
  providers: [CidadesService],
})
export class CidadesModule {}
