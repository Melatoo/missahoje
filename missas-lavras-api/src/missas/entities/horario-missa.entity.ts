import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Comunidade } from '../../comunidades/entities/comunidade.entity';

@Entity('horarios_missa')
export class HorarioMissa {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    comunidade_id: string;

    @Column({ type: 'smallint', nullable: false })
    dia_semana: number;

    @Column({ type: 'time', nullable: false })
    horario: string;

    @Column({ type: 'varchar', nullable: true })
    observacao: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Comunidade, (comunidade) => comunidade.horarios_missa)
    @JoinColumn({ name: 'comunidade_id' })
    comunidade: Comunidade;
}
