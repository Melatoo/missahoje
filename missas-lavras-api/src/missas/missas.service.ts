import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioMissa } from './entities/horario-missa.entity';
import { GetMissasDto } from './dto/get-missas.dto';
import { CreateMissaDto } from './dto/create-missa.dto';
import { UpdateMissaDto } from './dto/update-missa.dto';

@Injectable()
export class MissasService {
    constructor(
        @InjectRepository(HorarioMissa)
        private readonly horarioMissaRepository: Repository<HorarioMissa>,
    ) {}

    async findAll(query: GetMissasDto) {
        const qb = this.horarioMissaRepository
            .createQueryBuilder('horario')
            .leftJoinAndSelect('horario.comunidade', 'comunidade')
            .leftJoinAndSelect('comunidade.paroquia', 'paroquia')
            .where('horario.ativo = :ativo', { ativo: true })
            .andWhere('comunidade.ativo = :ativo', { ativo: true })
            .andWhere('paroquia.ativo = :ativo', { ativo: true });

        if (query.dia_semana !== undefined) {
            qb.andWhere('horario.dia_semana = :dia_semana', {
                dia_semana: query.dia_semana,
            });
        }

        if (query.bairro) {
            qb.andWhere('comunidade.bairro ILIKE :bairro', {
                bairro: `%${query.bairro}%`,
            });
        }

        return await qb.getMany();
    }

    async create(createMissaDto: CreateMissaDto) {
        const missa = this.horarioMissaRepository.create(createMissaDto);
        return await this.horarioMissaRepository.save(missa);
    }

    async findOne(id: string) {
        const missa = await this.horarioMissaRepository.findOne({
            where: { id },
            relations: ['comunidade', 'comunidade.paroquia'],
        });
        if (!missa) {
            throw new NotFoundException('Horário de missa não encontrado');
        }
        return missa;
    }

    async update(id: string, updateMissaDto: UpdateMissaDto) {
        const missa = await this.horarioMissaRepository.preload({
            id,
            ...updateMissaDto,
        });

        if (!missa) {
            throw new NotFoundException('Horário de missa não encontrado');
        }

        return await this.horarioMissaRepository.save(missa);
    }

    async remove(id: string) {
        const missa = await this.findOne(id);
        return await this.horarioMissaRepository.remove(missa);
    }
}
