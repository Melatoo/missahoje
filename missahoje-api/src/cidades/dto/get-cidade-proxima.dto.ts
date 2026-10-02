import { IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCidadeProximaDto {
    @Type(() => Number)
    @IsNumber({}, { message: 'A latitude é obrigatória.' })
    @Min(-90)
    @Max(90)
    lat: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'A longitude é obrigatória.' })
    @Min(-180)
    @Max(180)
    lng: number;
}
