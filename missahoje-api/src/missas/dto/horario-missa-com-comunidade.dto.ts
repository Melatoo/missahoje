import { ComunidadeComParoquiaECidadeDto } from '../../comunidades/dto/comunidade-com-paroquia-e-cidade.dto';
import { HorarioMissaDto } from './horario-missa.dto';

export class HorarioMissaComComunidadeDto extends HorarioMissaDto {
    comunidade: ComunidadeComParoquiaECidadeDto;
}
