import { CidadeDto } from '../../cidades/dto/cidade.dto';
import { ComunidadeDto } from './comunidade.dto';

export class ComunidadeComCidadeDto extends ComunidadeDto {
    cidade: CidadeDto | null;
}
