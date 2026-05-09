import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUsuarioDto {
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    @IsString()
    nome: string;

    @IsNotEmpty({ message: 'O email é obrigatório.' })
    @IsEmail({}, { message: 'Forneça um email válido.' })
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }, {
        message: 'A senha deve conter pelo menos 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais.'
    })
    senha: string;
}