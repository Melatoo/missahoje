import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';
import { Cidade } from './entities/cidade.entity';

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

  async findAll() {
    return await this.cidadesRepository.find();
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
