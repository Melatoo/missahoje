import { TimestampsDto } from '../../common/dto/timestamps.dto';

export class ParoquiaDto extends TimestampsDto {
    id: string;
    nome: string;
    telefone: string | null;
    siteOuRedeSocial: string | null;
}
