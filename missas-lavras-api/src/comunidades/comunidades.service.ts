import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comunidade } from './entities/comunidade.entity';
import { Repository } from 'typeorm';
import { CreateComunidadeDto } from './dto/create-comunidade.dto';
import { UpdateComunidadeDto } from './dto/update-comunidade.dto';

@Injectable()
export class ComunidadesService {
    constructor(
        @InjectRepository(Comunidade)
        private readonly comunidadesRepository: Repository<Comunidade>,
    ) {}

    async create(createComunidadeDto: CreateComunidadeDto) {
        const comunidade =
            this.comunidadesRepository.create(createComunidadeDto);
        return await this.comunidadesRepository.save(comunidade);
    }

    async findAll(cidadeId?: string, nome?: string) {
        const where: any = {};
        if (cidadeId) where.cidade_id = cidadeId;
        if (nome) where.nome = nome;

        return await this.comunidadesRepository.find({
            where,
            relations: ['paroquia', 'cidade', 'horarios_missa'],
        });
    }

    async findOne(id: string) {
        const comunidade = await this.comunidadesRepository.findOne({
            where: { id },
            relations: ['paroquia', 'cidade', 'horarios_missa'],
        });
        if (!comunidade) {
            throw new NotFoundException('Comunidade não encontrada');
        }
        return comunidade;
    }

    async update(id: string, updateComunidadeDto: UpdateComunidadeDto) {
        const comunidade = await this.comunidadesRepository.preload({
            id,
            ...updateComunidadeDto,
        });

        if (!comunidade) {
            throw new NotFoundException('Comunidade não encontrada');
        }

        return await this.comunidadesRepository.save(comunidade);
    }

    async remove(id: string) {
        const comunidade = await this.findOne(id);
        return await this.comunidadesRepository.softRemove(comunidade);
    }
}
