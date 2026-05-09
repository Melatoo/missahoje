import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comunidade } from "./entities/comunidade.entity";
import { Repository } from "typeorm";
import { CreateComunidadeDto } from "./dto/create-paroquias.dto";
import { UpdateComunidadeDto } from "./dto/update-comunidades.dto";

@Injectable()
export class ComunidadesService {
    constructor(
        @InjectRepository(Comunidade)
        private readonly comunidadesRepository: Repository<Comunidade>,
    ) { }

    async create(createComunidadeDto: CreateComunidadeDto) {
        const comunidade = this.comunidadesRepository.create(createComunidadeDto);
        return await this.comunidadesRepository.save(comunidade);
    }

    async findAll() {
        return await this.comunidadesRepository.find();
    }

    async findByName(name: string) {
        return await this.comunidadesRepository.findOne({ where: { nome: name } });
    }

    async update(id: string, updateComunidadeDto: UpdateComunidadeDto) {
        const comunidade = await this.comunidadesRepository.preload({
            id,
            ...updateComunidadeDto,
        });

        if (!comunidade) {
            throw new Error('Comunidade não encontrada');
        }

        return await this.comunidadesRepository.save(comunidade);
    }
}