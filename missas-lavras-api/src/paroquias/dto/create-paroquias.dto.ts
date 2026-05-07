import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateParoquiaDto {
    @Type(() => String)
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsString()
    readonly telefone?: string;

    @IsOptional()
    @IsString()
    readonly site_ou_rede_social?: string;
}
