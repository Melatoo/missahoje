import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class CreateUsuarioDto {
    @Type(() => String)
    @IsEmail()
    email: string;

    @Type(() => String)
    @IsString()
    @Matches(/(?=.*\d)(?=.*[@$!%*?&])/)    
    @MinLength(8)
    senha: string;
}