import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Not, Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { GetCidadeProximaDto } from './dto/get-cidade-proxima.dto';
import { GetCidadesDto } from './dto/get-cidades.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';
import { Cidade } from './entities/cidade.entity';
import { findNearest } from './nearest';
import { ACENTUADAS, escapeLike, normalizeSearch, SEM_ACENTO } from './search';

@Injectable()
export class CidadesService {
    constructor(
        @InjectRepository(Cidade)
        private readonly cidadesRepository: Repository<Cidade>,
    ) {}

    async create(createCidadeDto: CreateCidadeDto) {
        const cidade = this.cidadesRepository.create(createCidadeDto);
        return await this.cidadesRepository.save(cidade);
    }

    async findAll(query: GetCidadesDto): Promise<Pagination<Cidade>> {
        const qb = this.cidadesRepository
            .createQueryBuilder('cidade')
            .orderBy('cidade.nome', 'ASC');

        const termo = normalizeSearch(query.nome ?? '');
        if (termo) {
            qb.andWhere(
                new Brackets((where) => {
                    where
                        .where(
                            'translate(lower(cidade.nome), :acentuadas, :semAcento) LIKE :nome',
                        )
                        .orWhere('cidade.slug LIKE :slug');
                }),
                {
                    acentuadas: ACENTUADAS,
                    semAcento: SEM_ACENTO,
                    nome: `%${escapeLike(termo)}%`,
                    slug: `%${escapeLike(termo.replace(/ /g, '-'))}%`,
                },
            );
        }

        return paginate<Cidade>(qb, {
            page: query.page || 1,
            limit: query.limit || 100,
        });
    }

    async findNearest({ lat, lng }: GetCidadeProximaDto) {
        const cidades = await this.cidadesRepository.find({
            where: { latitude: Not(IsNull()), longitude: Not(IsNull()) },
        });
        const cidade = findNearest(cidades, { lat, lng });
        if (!cidade) {
            throw new NotFoundException(
                'Nenhuma cidade atendida perto dessa posição',
            );
        }
        return cidade;
    }

    async findOne(id: string) {
        const cidade = await this.cidadesRepository.findOne({ where: { id } });
        if (!cidade) {
            throw new NotFoundException('Cidade não encontrada');
        }
        return cidade;
    }

    async update(id: string, updateCidadeDto: UpdateCidadeDto) {
        const cidade = await this.cidadesRepository.preload({
            id,
            ...updateCidadeDto,
        });

        if (!cidade) {
            throw new NotFoundException('Cidade não encontrada');
        }

        return await this.cidadesRepository.save(cidade);
    }

    async remove(id: string) {
        const cidade = await this.findOne(id);
        return await this.cidadesRepository.softRemove(cidade);
    }
}
