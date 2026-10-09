import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class GetCidadesDto extends PaginationDto {
    /** Trecho do nome ou do slug; ignora acento e caixa ("sao joao"). */
    @IsOptional()
    @IsString()
    @MaxLength(100)
    nome?: string;
}
