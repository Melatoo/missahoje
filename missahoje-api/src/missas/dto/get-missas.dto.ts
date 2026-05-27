import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class GetMissasDto extends PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(6)
    dia_semana?: number;

    @IsOptional()
    @IsString()
    bairro?: string;

    @IsOptional()
    @IsString()
    cidadeId?: string;
}
