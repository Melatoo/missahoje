import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateParoquiaDto {
    @IsNotEmpty({ message: 'O nome da paróquia é obrigatório.' })
    @IsString()
    readonly nome: string;

    @IsOptional()
    @IsString()
    readonly telefone?: string;

    @IsOptional()
    @IsString()
    readonly siteOuRedeSocial?: string;
}
