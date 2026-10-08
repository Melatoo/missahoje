import { ParoquiaDto } from '../../paroquias/dto/paroquia.dto';
import { ComunidadeComCidadeDto } from './comunidade-com-cidade.dto';

export class ComunidadeComParoquiaECidadeDto extends ComunidadeComCidadeDto {
    paroquia: ParoquiaDto;
}
