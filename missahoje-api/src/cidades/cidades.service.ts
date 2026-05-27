import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';
import { Cidade } from './entities/cidade.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

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

  async findAll(options: PaginationDto): Promise<Pagination<Cidade>> {
    return paginate<Cidade>(this.cidadesRepository, {
      page: options.page || 1,
      limit: options.limit || 100,
    });
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
