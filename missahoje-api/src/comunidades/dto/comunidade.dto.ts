import { TimestampsDto } from '../../common/dto/timestamps.dto';

export class ComunidadeDto extends TimestampsDto {
    id: string;
    paroquia_id: string;
    cidade_id: string | null;
    nome: string;
    endereco: string;
    bairro: string;
    link_google_maps: string | null;
}
