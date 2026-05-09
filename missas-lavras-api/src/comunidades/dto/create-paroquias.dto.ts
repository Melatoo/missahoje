import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateComunidadeDto {
    @IsNotEmpty({ message: 'O nome da comunidade é obrigatório.' })
    @IsString()
    readonly nome: string;

    @IsNotEmpty({ message: 'O endereço é obrigatório.' })
    @IsString()
    readonly endereco: string;

    @IsNotEmpty({ message: 'O bairro é obrigatório.' })
    @IsString()
    readonly bairro: string;

    @IsOptional()
    @IsString()
    readonly siteOuRedeSocial?: string;
}