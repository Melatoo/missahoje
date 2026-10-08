import { TimestampsDto } from '../../common/dto/timestamps.dto';
import { UserRole } from '../entities/usuario.entity';

export class UsuarioDto extends TimestampsDto {
    id: string;
    nome: string;
    email: string;
    role: UserRole;
    cidade_id: string | null;
}
