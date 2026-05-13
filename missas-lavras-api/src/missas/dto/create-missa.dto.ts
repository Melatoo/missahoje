import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, Min, Max, Matches } from 'class-validator';

export class CreateMissaDto {
    @IsNotEmpty({ message: 'O ID da comunidade é obrigatório.' })
    @IsUUID('4', { message: 'O ID da comunidade deve ser um UUID válido.' })
    readonly comunidade_id: string;

    @IsNotEmpty({ message: 'O dia da semana é obrigatório.' })
    @IsNumber()
    @Min(0)
    @Max(6)
    readonly dia_semana: number;

    @IsNotEmpty({ message: 'O horário é obrigatório.' })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
        message: 'O horário deve estar no formato HH:mm ou HH:mm:ss',
    })
    readonly horario: string;

    @IsOptional()
    @IsString()
    readonly observacao?: string;
}
