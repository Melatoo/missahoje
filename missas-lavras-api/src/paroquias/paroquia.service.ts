import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paroquia } from "./entities/paroquia.entity";
import { Repository } from "typeorm";
import { CreateParoquiaDto } from "./dto/create-paroquia.dto";
import { UpdateParoquiaDto } from "./dto/update-paroquia.dto";

@Injectable()
export class ParoquiaService {
    constructor(
        @InjectRepository(Paroquia)
        private readonly paroquiaRepository: Repository<Paroquia>,
    ) { }

    async create(createParoquiaDto: CreateParoquiaDto) {
        const paroquia = this.paroquiaRepository.create(createParoquiaDto);
        return await this.paroquiaRepository.save(paroquia);
    }

    async findAll(nome?: string) {
        if (nome) {
            return await this.paroquiaRepository.find({ where: { nome } });
        }
        return await this.paroquiaRepository.find();
    }

    async findOne(id: string) {
        const paroquia = await this.paroquiaRepository.findOne({ where: { id } });
        if (!paroquia) {
            throw new NotFoundException('Paróquia não encontrada');
        }
        return paroquia;
    }

    async update(id: string, updateParoquiaDto: UpdateParoquiaDto) {
        const paroquia = await this.paroquiaRepository.preload({
            id,
            ...updateParoquiaDto,
        });

        if (!paroquia) {
            throw new NotFoundException('Paróquia não encontrada');
        }

        return await this.paroquiaRepository.save(paroquia);
    }

    async remove(id: string) {
        const paroquia = await this.findOne(id);
        return await this.paroquiaRepository.remove(paroquia);
    }
}