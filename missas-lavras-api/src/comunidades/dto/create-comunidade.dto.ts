import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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

    @IsNotEmpty({ message: 'O ID da paróquia é obrigatório.' })
    @IsUUID('4', { message: 'O ID da paróquia deve ser um UUID válido.' })
    readonly paroquia_id: string;

    @IsOptional()
    @IsString()
    readonly link_google_maps?: string;

    @IsOptional()
    @IsUUID('4', { message: 'O ID da cidade deve ser um UUID válido.' })
    readonly cidade_id?: string;
}
