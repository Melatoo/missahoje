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

@Entity('paroquias')
export class Paroquia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    nome: string;

    @Column({ type: 'varchar', nullable: true })
    telefone: string;

    @Column({ name: 'site_ou_rede_social', type: 'varchar', nullable: true })
    siteOuRedeSocial: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(
        () => Comunidade,
        (comunidade: Comunidade) => comunidade.paroquia,
    )
    comunidades: Comunidade[];
}
