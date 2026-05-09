import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity";
import { Repository } from "typeorm";
import bcryptjs from 'bcryptjs';
import { CreateUsuarioDto } from "./dto/create-usuario.dto";

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuariosRepository: Repository<Usuario>,
    ) {}

    async create(createUsuarioDto: CreateUsuarioDto) {
        const emailExists = await this.findByEmail(createUsuarioDto.email);
        if (emailExists) {
            throw new Error('Email já cadastrado');
        }
        
        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(createUsuarioDto.senha, salt);

        const usuario = this.usuariosRepository.create(createUsuarioDto);
        usuario.senha = hash;
        
        return await this.usuariosRepository.save(usuario);
    }

    async findByEmail(email: string) {
        return await this.usuariosRepository.findOne({ where: { email } });
    }   
}