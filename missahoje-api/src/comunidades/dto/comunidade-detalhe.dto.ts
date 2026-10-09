import { HorarioMissaDto } from '../../missas/dto/horario-missa.dto';
import { ComunidadeComParoquiaECidadeDto } from './comunidade-com-paroquia-e-cidade.dto';

export class ComunidadeDetalheDto extends ComunidadeComParoquiaECidadeDto {
    horarios_missa: HorarioMissaDto[];
}
