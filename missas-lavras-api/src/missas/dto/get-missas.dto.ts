import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMissasDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(6)
    dia_semana?: number;

    @IsOptional()
    @IsString()
    bairro?: string;
}
