import { TimestampsDto } from '../../common/dto/timestamps.dto';

export class CidadeDto extends TimestampsDto {
    id: string;
    nome: string;
    estado: string;
    slug: string;
    latitude: number | null;
    longitude: number | null;
}
