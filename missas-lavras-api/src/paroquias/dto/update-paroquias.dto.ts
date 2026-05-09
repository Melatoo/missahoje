import { PartialType } from "@nestjs/mapped-types";
import { CreateParoquiaDto } from "./create-paroquias.dto";

export class UpdateParoquiaDto extends PartialType(CreateParoquiaDto) { }
