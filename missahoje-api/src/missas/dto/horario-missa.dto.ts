import { ApiProperty } from '@nestjs/swagger';
import { TimestampsDto } from '../../common/dto/timestamps.dto';

export class HorarioMissaDto extends TimestampsDto {
    id: string;
    comunidade_id: string;

    @ApiProperty({ type: 'integer', enum: [0, 1, 2, 3, 4, 5, 6] })
    dia_semana: number;

    horario: string;
    observacao: string | null;
}
