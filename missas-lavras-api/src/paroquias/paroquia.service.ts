import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paroquia } from "./entities/paroquia.entity";
import { Repository } from "typeorm";
import { CreateParoquiaDto } from "./dto/create-paroquias.dto";
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

    async findAll() {
        return await this.paroquiaRepository.find();
    }

    async findByName(name: string) {
        return await this.paroquiaRepository.findOne({ where: { nome:name } });
    }

    async update(id: string, updateParoquiaDto: UpdateParoquiaDto) {
        const paroquia = await this.paroquiaRepository.preload({
            id,
            ...updateParoquiaDto,
        });

        if (!paroquia) {
            throw new Error('Paróquia não encontrada');
        }

        return await this.paroquiaRepository.save(paroquia);
    }   
}