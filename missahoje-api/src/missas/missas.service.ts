import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
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

    async findAll(query: GetMissasDto): Promise<Pagination<HorarioMissa>> {
        const qb = this.createBaseQuery();

        this.applyFiltroDia(qb, query.dia_semana);
        this.applyFiltroBairro(qb, query.bairro);
        this.applyFiltroCidade(qb, query.cidadeId);

        return paginate<HorarioMissa>(qb, {
            page: query.page || 1,
            limit: query.limit || 100,
        });
    }

    private createBaseQuery() {
        return this.horarioMissaRepository
            .createQueryBuilder('horario')
            .leftJoinAndSelect('horario.comunidade', 'comunidade')
            .leftJoinAndSelect('comunidade.paroquia', 'paroquia')
            .leftJoinAndSelect('comunidade.cidade', 'cidade');
    }

    private applyFiltroDia(qb: any, dia_semana?: number) {
        if (dia_semana !== undefined) {
            qb.andWhere('horario.dia_semana = :dia_semana', { dia_semana });
        }
    }

    private applyFiltroBairro(qb: any, bairro?: string) {
        if (bairro) {
            qb.andWhere('comunidade.bairro ILIKE :bairro', {
                bairro: `%${bairro}%`,
            });
        }
    }

    private applyFiltroCidade(qb: any, cidadeId?: string) {
        if (cidadeId) {
            qb.andWhere('comunidade.cidade_id = :cidadeId', { cidadeId });
        }
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
        return await this.horarioMissaRepository.softRemove(missa);
    }
}
