import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import bcryptjs from 'bcryptjs';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuariosRepository: Repository<Usuario>,
    ) {}

    async create(createUsuarioDto: CreateUsuarioDto) {
        const emailExists = await this.findByEmail(createUsuarioDto.email);
        if (emailExists) {
            throw new ConflictException('Email já cadastrado');
        }

        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(createUsuarioDto.senha, salt);

        const usuario = this.usuariosRepository.create(createUsuarioDto);
        usuario.senha = hash;

        return await this.usuariosRepository.save(usuario);
    }

    async findAll(options: PaginationDto): Promise<Pagination<Usuario>> {
        return paginate<Usuario>(this.usuariosRepository, {
            page: options.page || 1,
            limit: options.limit || 100,
        });
    }

    async findOne(id: string) {
        const usuario = await this.usuariosRepository.findOne({
            where: { id },
        });
        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return usuario;
    }

    async findByEmail(email: string) {
        return await this.usuariosRepository.findOne({ where: { email } });
    }

    async findByEmailWithPassword(email: string) {
        return await this.usuariosRepository
            .createQueryBuilder('usuarios')
            .addSelect('usuarios.senha')
            .where('usuarios.email = :email', { email })
            .getOne();
    }

    async validateCredentials(
        email: string,
        senhaLimpa: string,
    ): Promise<Omit<Usuario, 'senha'> | null> {
        const usuario = await this.findByEmailWithPassword(email);

        if (usuario) {
            const isMatch = await bcryptjs.compare(senhaLimpa, usuario.senha);
            if (isMatch) {
                const { senha, ...result } = usuario;
                return result;
            }
        }

        return null;
    }

    async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
        const usuario = await this.usuariosRepository.preload({
            id,
            ...updateUsuarioDto,
        });

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }

        if (updateUsuarioDto.senha) {
            const salt = await bcryptjs.genSalt();
            usuario.senha = await bcryptjs.hash(updateUsuarioDto.senha, salt);
        }

        return await this.usuariosRepository.save(usuario);
    }

    async remove(id: string) {
        const usuario = await this.findOne(id);
        return await this.usuariosRepository.softRemove(usuario);
    }
}
