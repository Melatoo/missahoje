import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HorarioMissa } from './entities/horario-missa.entity';
import { GetMissasDto } from './dto/get-missas.dto';

@Injectable()
export class MissasService {
    constructor(
        @InjectRepository(HorarioMissa)
        private readonly horarioMissaRepository: Repository<HorarioMissa>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async findAll(query: GetMissasDto) {
        const cacheKey = `missas:${query.dia_semana ?? 'all'}:${query.bairro ?? 'all'}`;

        // Cache-Aside: check Redis first
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        // Build the query
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

        const missas = await qb.getMany();

        // Save to Redis with 30 days TTL (in milliseconds: 30 * 24 * 60 * 60 * 1000)
        // Note: older versions of cache-manager use seconds, newer use milliseconds.
        // Since NestJS cache-manager defaults to ms, we use 2592000000
        await this.cacheManager.set(cacheKey, missas, 2592000000);

        return missas;
    }
}
