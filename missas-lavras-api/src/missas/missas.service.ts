import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HorarioMissa } from './entities/horario-missa.entity';
import { GetMissasDto } from './dto/get-missas.dto';
import { CreateMissaDto } from './dto/create-missa.dto';
import { UpdateMissaDto } from './dto/update-missa.dto';

@Injectable()
export class MissasService {
    constructor(
        @InjectRepository(HorarioMissa)
        private readonly horarioMissaRepository: Repository<HorarioMissa>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async findAll(query: GetMissasDto) {
        const cacheKey = `missas:${query.dia_semana ?? 'all'}:${query.bairro ?? 'all'}`;

        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

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

    async create(createMissaDto: CreateMissaDto) {
        const missa = this.horarioMissaRepository.create(createMissaDto);
        return await this.horarioMissaRepository.save(missa);
    }

    async findOne(id: string) {
        const missa = await this.horarioMissaRepository.findOne({ where: { id } });
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
