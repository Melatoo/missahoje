import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { HorarioMissa } from './entities/horario-missa.entity';
import { GetMissasDto } from './dto/get-missas.dto';

@Injectable()
export class MissasRepository {
    constructor(
        @InjectRepository(HorarioMissa)
        private readonly repository: Repository<HorarioMissa>,
    ) {}

    async findWithFilters(query: GetMissasDto): Promise<Pagination<HorarioMissa>> {
        const qb = this.repository
            .createQueryBuilder('horario')
            .leftJoinAndSelect('horario.comunidade', 'comunidade')
            .leftJoinAndSelect('comunidade.paroquia', 'paroquia')
            .leftJoinAndSelect('comunidade.cidade', 'cidade');

        if (query.dia_semana !== undefined) {
            qb.andWhere('horario.dia_semana = :dia_semana', { dia_semana: query.dia_semana });
        }

        if (query.bairro) {
            qb.andWhere('comunidade.bairro ILIKE :bairro', {
                bairro: `%${query.bairro}%`,
            });
        }

        if (query.cidadeId) {
            qb.andWhere('comunidade.cidade_id = :cidadeId', { cidadeId: query.cidadeId });
        }

        return paginate<HorarioMissa>(qb, {
            page: query.page || 1,
            limit: query.limit || 100,
        });
    }

    create(data: DeepPartial<HorarioMissa>): HorarioMissa {
        return this.repository.create(data);
    }

    async save(data: HorarioMissa): Promise<HorarioMissa> {
        return this.repository.save(data);
    }

    async findOne(options: any): Promise<HorarioMissa | null> {
        return this.repository.findOne(options);
    }

    async preload(data: any): Promise<HorarioMissa | undefined> {
        return this.repository.preload(data);
    }

    async softRemove(data: HorarioMissa): Promise<HorarioMissa> {
        return this.repository.softRemove(data);
    }
}
