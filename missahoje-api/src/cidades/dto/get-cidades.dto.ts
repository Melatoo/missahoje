import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class GetCidadesDto extends PaginationDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    nome?: string;
}
