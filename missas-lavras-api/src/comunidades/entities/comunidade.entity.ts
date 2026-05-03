import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Paroquia } from '../../paroquias/entities/paroquia.entity';
import { HorarioMissa } from '../../missas/entities/horario-missa.entity';

@Entity('comunidades')
export class Comunidade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    paroquia_id: string;

    @Column({ type: 'varchar', nullable: false })
    nome: string;

    @Column({ type: 'varchar', nullable: false })
    endereco: string;

    @Column({ type: 'varchar', nullable: false })
    bairro: string;

    @Column({ type: 'text', nullable: true })
    link_google_maps: string;

    @Column({ type: 'boolean', default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Paroquia, (paroquia) => paroquia.comunidades)
    @JoinColumn({ name: 'paroquia_id' })
    paroquia: Paroquia;

    @OneToMany(() => HorarioMissa, (horarioMissa) => horarioMissa.comunidade)
    horarios_missa: HorarioMissa[];
}
