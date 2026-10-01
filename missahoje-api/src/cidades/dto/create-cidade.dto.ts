import { IsNotEmpty, IsNumber, IsString, Length, Matches, Max, Min } from 'class-validator';

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

    @IsNumber({}, { message: 'A latitude do centro da cidade é obrigatória.' })
    @Min(-90)
    @Max(90)
    latitude: number;

    @IsNumber({}, { message: 'A longitude do centro da cidade é obrigatória.' })
    @Min(-180)
    @Max(180)
    longitude: number;
}
