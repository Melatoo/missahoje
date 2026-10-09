import { ComunidadeComCidadeDto } from '../../comunidades/dto/comunidade-com-cidade.dto';
import { ParoquiaDto } from './paroquia.dto';

export class ParoquiaComComunidadesDto extends ParoquiaDto {
    comunidades: ComunidadeComCidadeDto[];
}
