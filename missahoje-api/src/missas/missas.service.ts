import { Injectable, NotFoundException } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { HorarioMissa } from './entities/horario-missa.entity';
import { GetMissasDto } from './dto/get-missas.dto';
import { CreateMissaDto } from './dto/create-missa.dto';
import { UpdateMissaDto } from './dto/update-missa.dto';
import { MissasRepository } from './missas.repository';

@Injectable()
export class MissasService {
    constructor(
        private readonly missasRepository: MissasRepository,
    ) {}

    async findAll(query: GetMissasDto): Promise<Pagination<HorarioMissa>> {
        return this.missasRepository.findWithFilters(query);
    }

    async create(createMissaDto: CreateMissaDto) {
        const missa = this.missasRepository.create(createMissaDto);
        return await this.missasRepository.save(missa);
    }

    async findOne(id: string) {
        const missa = await this.missasRepository.findOne({
            where: { id },
            relations: ['comunidade', 'comunidade.paroquia'],
        });
        if (!missa) {
            throw new NotFoundException('Horário de missa não encontrado');
        }
        return missa;
    }

    async update(id: string, updateMissaDto: UpdateMissaDto) {
        const missa = await this.missasRepository.preload({
            id,
            ...updateMissaDto,
        });

        if (!missa) {
            throw new NotFoundException('Horário de missa não encontrado');
        }

        return await this.missasRepository.save(missa);
    }

    async remove(id: string) {
        const missa = await this.findOne(id);
        return await this.missasRepository.softRemove(missa);
    }
}
