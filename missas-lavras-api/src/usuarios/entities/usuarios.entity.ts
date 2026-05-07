import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity('usuarios')
export class Usuarios {
    @PrimaryGeneratedColumn({ type: 'uuid' })
    id: string;

    @Column({ type: 'varchar', nullable: false })
    nome: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: false, select: false })
    @Exclude()
    senha: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
        nullable: false,
    })
    role: UserRole;

    @Column({ type: 'boolean', default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}