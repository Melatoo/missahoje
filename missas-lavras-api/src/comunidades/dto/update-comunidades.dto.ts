import { PartialType } from "@nestjs/mapped-types";
import { CreateComunidadeDto } from "./create-paroquias.dto";

export class UpdateComunidadeDto extends PartialType(CreateComunidadeDto) { }