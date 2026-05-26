import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Comunidade } from '../../comunidades/entities/comunidade.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('cidades')
export class Cidade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    nome: string;

    @Column({ type: 'varchar', length: 2, nullable: false })
    estado: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    slug: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(
        () => Comunidade,
        (comunidade: Comunidade) => comunidade.cidade,
    )
    comunidades: Comunidade[];

    @OneToMany(
        () => Usuario,
        (usuario: Usuario) => usuario.cidade,
    )
    usuarios: Usuario[];
}
