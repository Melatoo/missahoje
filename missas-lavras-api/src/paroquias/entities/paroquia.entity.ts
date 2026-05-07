import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Comunidade } from '../../comunidades/entities/comunidade.entity';

@Entity('paroquias')
export class Paroquia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    nome: string;

    @Column({ type: 'varchar', nullable: true })
    telefone: string;

    @Column({ type: 'varchar', nullable: true })
    site_ou_rede_social: string;

    @Column({ type: 'boolean', default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Comunidade, (comunidade: Comunidade) => comunidade.paroquia)
    comunidades: Comunidade[];
}
