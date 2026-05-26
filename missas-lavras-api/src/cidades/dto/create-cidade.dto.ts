import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateCidadeDto {
    @IsNotEmpty({ message: 'O nome da cidade é obrigatório.' })
    @IsString()
    nome: string;

    @IsNotEmpty({ message: 'O estado (UF) é obrigatório.' })
    @IsString()
    @Length(2, 2, { message: 'O estado deve ter exatamente 2 caracteres (ex: MG).' })
    estado: string;

    @IsNotEmpty({ message: 'O slug é obrigatório.' })
    @IsString()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'O slug deve conter apenas letras minúsculas, números e hifens.',
    })
    slug: string;
}
