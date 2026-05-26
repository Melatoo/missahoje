import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Paroquia } from '../../paroquias/entities/paroquia.entity';
import { HorarioMissa } from '../../missas/entities/horario-missa.entity';
import { Cidade } from '../../cidades/entities/cidade.entity';

@Entity('comunidades')
export class Comunidade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    paroquia_id: string;

    @Column({ type: 'uuid', nullable: true })
    cidade_id: string;

    @Column({ type: 'varchar', nullable: false })
    nome: string;

    @Column({ type: 'varchar', nullable: false })
    endereco: string;

    @Column({ type: 'varchar', nullable: false })
    bairro: string;

    @Column({ type: 'text', nullable: true })
    link_google_maps: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Paroquia, (paroquia) => paroquia.comunidades)
    @JoinColumn({ name: 'paroquia_id' })
    paroquia: Paroquia;

    @ManyToOne(() => Cidade, (cidade) => cidade.comunidades)
    @JoinColumn({ name: 'cidade_id' })
    cidade: Cidade;

    @OneToMany(() => HorarioMissa, (horarioMissa) => horarioMissa.comunidade)
    horarios_missa: HorarioMissa[];
}
